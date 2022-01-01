import * as WebSocket from 'ws';
import * as ytdl from 'ytdl-core';
import * as Database from 'better-sqlite3';

import DB from './DB';
import Web from './Web';
import Downloader from './Downloader';
import Compressor from './Compressor';

import { clientVerification, sendUserMessage } from './Protocol';
import { currentUnix } from '../lib/utils/utils';
import { FORM_TYPES, UserCodes } from '../lib/utils/server';
import { DEBUG_SERVER } from '../lib/utils/debug';
import {
	CServer, IaULProps, IWebSocketResult,
	IUserBuffer, IUserRequest, IPromiseResult,
	IDownloader, ICompressor
} from '../lib/types/server';

export default class Server implements CServer {
	public readonly PORT: number = 8080;
	public server: WebSocket.Server;
	public db: Database;
	public activeUsersList: Map<string, IaULProps>;

	constructor() {
		const db = new DB();

		const ws = new WebSocket.Server({
			host: '0.0.0.0',
			port: this.PORT,
			verifyClient: clientVerification.bind(null, db._db)
		});
		ws.on("connection", this.connection);

		const web = new Web(db._db, db._sessionDriver);
		web.init();

		this.server = ws;
		this.db = db._db;
		this.activeUsersList = new Map();

		this.usersAlive();
	}

	connection = (ws: IWebSocketResult, req: object): void => {
		ws.isAlive = true;
		ws.on("pong", this.heartBeat);
		ws.on("message", this.handleUserRequest.bind(this, ws, req));
	}

	validateUserRequest(properties: Array<any>): boolean {
		if(properties[1] < 0 || properties[1] > 1) {
			return false;
		} else if(properties[2] < 0 || properties[2] > 3) {
			return false;
		} else if(properties[3] && properties[4]) {
			let prop3 = properties[3].match(/^[0-5][0-9]:[0-5][0-9]$/g);
			let prop4 = properties[4].match(/^[0-5][0-9]:[0-5][0-9]$/g);

			if(prop3 && prop4) {
				if(prop4 > prop3 || prop3 === prop4) {
					return false;
				}
			} else {
				return false;
			}
		} else if(!ytdl.validateURL(properties[0])) {
			return false;
		}
		return true;
	}

	handleUserRequest = (ws: WebSocket, req: IUserRequest, buf: string): void => {
		const userIP: string = req.connection.remoteAddress;

		if(!this.activeUsersList.has(userIP)) {
			this.activeUsersList.set(userIP, {
				client: ws,
				lastAction: currentUnix(),
				attempts: 0
			});
			DEBUG_SERVER('handleUserRequest() -> activeUsersList don\'t have %s', userIP);
		} else {
			const cUnix = currentUnix();
			const difference = Math.floor((cUnix - this.activeUsersList.get(userIP).lastAction) / 1000);
			if(difference >= 10) {
				this.activeUsersList.set(userIP, {
					lastAction: cUnix,
					attempts: 0
				});
				DEBUG_SERVER('handleUserRequest() -> activeUsersList %s difference: %s', userIP, difference);
			} else {
				// notify user if last action was performed
				let attempts = this.activeUsersList.get(userIP).attempts;
				if(attempts > 3) {
					sendUserMessage(ws, [UserCodes.TooManyAttempts, attempts]);
					this.activeUsersList.delete(userIP);
					ws.terminate();
					DEBUG_SERVER('handleUserRequest() -> activeUsersList %s connection closed, attempts: %s', userIP, attempts);
				} else {
					sendUserMessage(ws, [UserCodes.LastUserAction, attempts, difference]);
					this.activeUsersList.set(userIP, {
						attempts: this.activeUsersList.get(userIP).attempts++
					});
					DEBUG_SERVER('handleUserRequest() -> activeUsersList %s, attempts: %s', userIP, attempts);
				}
				return;
			}
		}

		const userBuf: IUserBuffer = JSON.parse(buf);

		const chIFormat: number = Number(userBuf.format_type);
		const chIQuality: number = Number(userBuf.quality);
		const chICodec: number = Number(userBuf.format_type);

		const chVidURL: string = userBuf.video_url;
		const chTFormat: string = FORM_TYPES.format_type[chIFormat];
		const chTQuality: string = FORM_TYPES.quality[chIQuality];
		const chTSW: string = userBuf.start_with;
		const chTEW: string = userBuf.end_with;
		const pTCodec: string = FORM_TYPES.codecs[chICodec];

		// Server user request validation
		const validateReq = this.validateUserRequest([chVidURL, chIFormat, chIQuality, chTSW, chTEW]);

		if(validateReq) {
			const videoID: any = ytdl.getVideoID(chVidURL);

			const _downloader: any = new Downloader(ws, this.db, chVidURL, videoID, chTFormat, chTQuality);
			const _compressor: any = new Compressor(ws, this.db, videoID, chTFormat, chTQuality, pTCodec);

			_downloader.getInfo().then((data: IPromiseResult) => {
					if(data.err) {
						throw data.errMsg;
					}
					DEBUG_SERVER('handleUserRequest() -> _downloader.getInfo()');
					return _downloader.run();
			}).then((obj: IDownloader) => {
					// don't let compressor run if some error msg appear
					DEBUG_SERVER('handleUserRequest() -> Promise chain after _downloader.run(), obj: %O', obj);
					if(!obj.errorCode) {
						return _compressor.run(obj.videoDuration, obj.videoMeta, obj.wasCompressed);
					} else {
						// send error to user and cancel other operations
						sendUserMessage(ws, [obj.errorCode]);
						return { cancel: true }
					}
			}).then((data: ICompressor) => {
					// skip this chain if cancel occured
					if(!data.cancel) {
						DEBUG_SERVER('handleUserRequest() -> Promise last chain, data: %O', data);
						if(data.fileIsLocked) {
							_compressor.changeLockedFileName();
						}
						sendUserMessage(ws,
							[UserCodes.Finished,
							data.videoMeta.title,
							data.videoMeta.media,
							data.videoMeta.author,
							data.videoMeta.thumbnail,
							data.videoMeta.video_url,
							data.sid,
							data.videoDuration, 
							data.fileSize,
							data.quality,
							data.format] // 10
						);
					}
			}).catch((err: IPromiseResult) => {
					this.activeUsersList.delete(userIP);
					throw err;
			});
		} else {
			// Validation failed
			sendUserMessage(ws, [UserCodes.ValidationFailed]);
		}
	}
	 
	heartBeat = function(): void {
		this.isAlive = true;
	}

	noop = function(): void {}

	usersAlive(): void {
		const interval: any = setInterval(() => {
			this.server.clients.forEach((ws: IWebSocketResult) => {
				if(ws.isAlive === false) {
					return ws.terminate();
				}
				ws.isAlive = false;
				ws.ping(this.noop);
			});
		}, 30000);
	}
}
