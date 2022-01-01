import * as WebSocket from 'ws';
import * as Database from 'better-sqlite3';

export interface CServer {
	readonly PORT: any;
	server: WebSocket.Server;
	db: Database;
	activeUsersList: Map<string, IaULProps>;
	connection(ws: IWebSocketResult, req: object): void;
	validateUserRequest(properties: Array<any>): boolean;
	handleUserRequest(ws: WebSocket, req: IUserRequest, buf: string): void;
	heartBeat(): void;
	noop(): void;
	usersAlive(): void;
}

export interface CDownloader {
	ws: WebSocket;
	db: Database;
	videoUrl?: string;
	videoID: string;
	format: string;
	quality: string;
	currentBuffer?: string;
	prevBuffer?: string[];
	videoDuration?: string;
	videoMeta?: any;
	prepareData?(resolve: Function, reject: Function, err: Error, data: IDownloaderVideoData): void;
	getInfo?(): void;
	run(videoDuration?: string, videoMeta?: any, wasCompressed?: boolean): Promise<object>;
	processData?(chunk: Buffer): void;
}

export interface CCompressor extends CDownloader {
	codec: string;
	sizeMultiplier: number;
	compressionProgress: number;
	getCompressedFileSize(): Promise<void>;
	changeLockedFileName(): void;
	parseData(data: { percent: number }): void;
}

export interface CWeb {
	readonly PORT: number;
	db: any;
	init(): void;
}

export interface IaULProps {
	client?: object;
	lastAction?: number;
	attempts: number;
}

export interface IVideoMeta {
	title: string;
	media: string | object;
	author: string | object;
	thumbnail: string;
	video_url: string;
	length?: number;
}

export interface ICompressor {
	videoMeta: IVideoMeta;
	sid: string;
	videoDuration: string;
	fileSize: string;
	quality: string;
	format: string;
	fileIsLocked?: boolean;
	cancel?: boolean;
}

export interface IDownloader {
	videoDuration: string;
	videoMeta: IVideoMeta;
	wasCompressed: boolean;
	errorCode: number;
}

export interface IDownloaderVideoData extends IVideoMeta {
	media: { artist: string, licensed_to_youtube_by: string };
	author: {
		name: string,
		avatar: string,
		user: string,
		channel_url: string
	};
	player_response: {
		videoDetails: {
			thumbnail: {
				thumbnails: {
					[index: string]: { url: string }
				};
			}
		}
	};
}

export interface IUserBuffer {
	video_url: string;
	format_type: string;
	quality: string;
	start_with: string;
	end_with: string;
}

export interface IUserRequest {
	connection: {
		remoteAddress: string;
	}
}

export interface IPromiseResult {
	err: Error;
	errMsg?: string;
}

export interface IWebSocketResult {
	isAlive?: boolean;
	on?: Function;
	ping: Function;
	terminate: Function;
}
