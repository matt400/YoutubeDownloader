import * as path from 'path';
import * as Database from 'better-sqlite3';
import * as WebSocket from 'ws';
import * as ytdl from 'ytdl-core';

import { spawn } from 'child_process';
import { sendUserMessage } from './Protocol';
import { UserCodes } from '../lib/utils/server';
import { currentUnix } from '../lib/utils/utils';
import { CDownloader, IVideoMeta, IDownloaderVideoData } from '../lib/types/server';

export default class Downloader implements CDownloader {
	public ws: WebSocket;
	public db: any;
	public videoUrl: string;
	public videoID: string;
	public format: string;
	public quality: string;
	public currentBuffer: string;
	public prevBuffer: string[];
	public videoDuration: string;
	public videoMeta: IVideoMeta;

	constructor(ws: WebSocket, db: any, videoUrl: string, videoID: string, format: string, quality: string) {
		this.ws = ws;
		this.db = db;
		this.videoUrl = videoUrl;
		this.videoID = videoID;
		this.format = format;
		this.quality = quality;
		this.currentBuffer = "";
		this.prevBuffer = [];
		this.videoDuration = "";
	}

	get _videoMeta() {
		if(this.videoMeta.length == 0) return undefined;
		return this.videoMeta;
	}

	prepareData = (resolve: Function, reject: Function, err: object, data: IDownloaderVideoData) => {
		if(err) {
			reject({ err: true, errMsg: err });
			throw err;
		}

		this.videoMeta = {
			title: data.title,
			media: {
				'artist': (data.media.artist ? data.media.artist : ''),
				'ltytb': (data.media.licensed_to_youtube_by ? data.media.licensed_to_youtube_by : '')
			},
			author: {
				'name': data.author.name,
				'avatar': data.author.avatar,
				'user': data.author.user,
				'channel_url': data.author.channel_url
			},
			thumbnail: data.player_response.videoDetails.thumbnail.thumbnails[2].url,
			video_url: data.video_url
		}

		resolve({ err: false });
	}

	getInfo() {
		return new Promise((resolve: Function, reject: Function) => {
			ytdl.getInfo(this.videoID, this.prepareData.bind(this, resolve, reject));
		});
	}

	async run(): Promise<object> {
		const db = this.db;

		// if user sent request again during compression of the same video, the record will exist
		// so we need to check if compression is finished

		const wasCompressed = db.checkIfRecordExists('compressed_files', {
			video_id: this.videoID,
			quality: this.quality,
			format: this.format
		});
		
		if(wasCompressed) {
			const query = db.selectSpecificColumns(['video_duration', 'finished_time'], 'compressed_files', {
				video_id: this.videoID,
				quality: this.quality,
				format: this.format
			});

			if(query.finished_time !== 0) {
				return {
					videoId: this.videoID,
					videoDuration: query.video_duration,
					videoMeta: this.videoMeta,
					wasCompressed: true,
					errorCode: false
				}
			} else {
				return {
					errorCode: UserCodes.AlreadyCompressing
				}
			}
		}

		// if user send request again, the record will exist
		// we need to check if the downloading is finished, if not we need to send error
		// query should check if finished_time is not 0

		const wasDownloaded = db.checkIfRecordExists('download_files', { video_id: this.videoID });

		if(wasDownloaded) {
			const query = db.selectSpecificColumns(['video_duration, finished_time'], 'download_files', { video_id: this.videoID });

			if(query.finished_time !== 0) {
				return {
					videoId: this.videoID,
					videoDuration: query.video_duration,
					videoMeta: this.videoMeta,
					wasCompressed: false,
					errorCode: false
				}
			} else {
				return {
					errorCode: UserCodes.AlreadyDownloading
				}
			}
		}

		// insert here before downloading
		db.insertValues('download_files', {
			video_id: this.videoID,
			video_duration: null,
			started_time: currentUnix(),
			finished_time: 0
		});

		const parentDir = path.resolve(__dirname, '../');
		try {
			const proc: any = spawn("python", ["wrapper.py", this.videoUrl], { cwd: parentDir, shell: true });
			for await (const data of proc.stdout) {
				this.processData(data);
			}
		} catch(err) {
			throw err;
		}

		return await {
			videoId: this.videoID,
			videoDuration: this.videoDuration,
			videoMeta: this.videoMeta,
			wasCompressed: false
		};
	}

	// stopgap
	processData = (chunk: Buffer) => {
		this.currentBuffer += chunk.toString("utf8");

		let lines: string[] = this.currentBuffer.split("\n");
		let i: number = 0;

		for (const x of lines) {
			let line: string = x.replace('\r', '');

			if(!this.videoDuration && line.length > 0 && line.length <= 7) {
				this.videoDuration = line;
			}

			if(line.indexOf("PHOOK") > -1) {
				let ol: any = line.split(",")
				ol[3] = Number(ol[3]);

				if((i % 20 && ol[0] == 'downloading') || ol[3] == 100) {
					if(ol[3] !== this.prevBuffer[0]) {
						sendUserMessage(this.ws, [UserCodes.Downloading, ol[3]]);
					}

					this.prevBuffer[0] = ol[3];
				}

				if(ol[0] == 'finished') {
					this.db.updateValues('download_files', {
						finished_time: currentUnix(),
						video_duration: this.videoDuration
					}, { video_id: this.videoID });
				}

				if(ol[0] == 'error') {
					throw 'ol[0] error';
				}
			}
			i++;
		}
	}
}
