import * as fs from 'fs';
import * as crypto from 'crypto';
import * as Database from 'better-sqlite3';
import * as WebSocket from 'ws';
import * as ffmpeg from 'fluent-ffmpeg';

import { sendUserMessage } from './Protocol';
import { M4AFilePath, compressedFilePath, sizeM, UserCodes } from '../lib/utils/server';
import { currentUnix, formatBytes } from '../lib/utils/utils';
import { CCompressor } from '../lib/types/server';

export default class Compressor implements CCompressor {
	public ws: WebSocket;
	public db: any;
	public videoID: string;
	public format: string;
	public quality: string;
	public codec: string;
	public sizeMultiplier: number;
	public compressionProgress: number;

	constructor(ws: WebSocket, db: any, videoID: string, format: string, quality: string, codec: string) {
		this.ws = ws;
		this.db = db;
		this.videoID = videoID;
		this.format = format;
		this.quality = quality;
		this.codec = codec;
		this.compressionProgress = 0;
	}

	async run(videoDuration: string, videoMeta: any, wasCompressed: boolean): Promise<object> {
		const db = this.db;

		if(wasCompressed) {
			const query = db.selectSpecificColumns(['filesize', 'sid'], 'compressed_files', {
				video_id: this.videoID,
				format: this.format
			});

			return {
				fileIsLocked: false,
				videoId: this.videoID,
				fileSize: query.filesize,
				videoDuration: videoDuration,
				quality: this.quality,
				format: this.format,
				videoMeta: videoMeta,
				sid: query.sid
			}
		}

		const randomSID = crypto.randomBytes(24).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

		// insert to db before compression
		db.insertValues('compressed_files', {
			video_id: this.videoID,
			quality: this.quality,
			format: this.format,
			real_name: videoMeta.title,
			filesize: null,
			video_duration: videoDuration,
			sid: randomSID,
			started_time: currentUnix(),
			finished_time: 0
		});

		const lockedPath = compressedFilePath(this.videoID, this.quality, "lock");

		await this.getCompressedFileSize();

		return new Promise((resolve: Function, reject: Function) => {
			const proc = ffmpeg(M4AFilePath(this.videoID));

			proc.noVideo();
			proc.audioBitrate(this.quality);
			proc.audioCodec(this.codec);
			proc.audioFrequency(48000);
			proc.format(this.format);

			proc.on('progress', this.parseData);

			proc.on('end', () => {
				const compressedSize = formatBytes(fs.statSync(lockedPath)["size"], 3);

				db.updateValues('compressed_files', {
					filesize: compressedSize,
					finished_time: currentUnix()
				}, {
					video_id: this.videoID,
					quality: this.quality,
					format: this.format
				});

				resolve({
					fileIsLocked: true,
					videoId: this.videoID,
					fileSize: compressedSize,
					videoDuration: videoDuration,
					quality: this.quality,
					format: this.format,
					videoMeta: videoMeta,
					sid: randomSID
				});
			});

			proc.on('error', (err) => {
				reject(err);
			});

			proc.save(lockedPath);
		}).catch((err) => {
			throw err;
		});
	}

	async getCompressedFileSize(): Promise<void> {
		const stats = await fs.promises.stat(M4AFilePath(this.videoID));
		const webmSize: number = Math.ceil(stats['size'] / 1000000.0);
		this.sizeMultiplier = sizeM(webmSize);
	}

	changeLockedFileName(): void {
		const lockedFile = compressedFilePath(this.videoID, this.quality, "lock");
		const compressedFile = compressedFilePath(this.videoID, this.quality, this.format);
		fs.rename(lockedFile, compressedFile, (err) => {
			if (err) throw err;
		});
	}

	parseData = (data: { percent: number }): void => {
		const perStr: string = Number(data.percent).toFixed(0);
		const percentage: number = Number(perStr);
		if(this.compressionProgress % this.sizeMultiplier === 0 || percentage == 100) {
			sendUserMessage(this.ws, [UserCodes.Compressing, percentage]);
		}
		this.compressionProgress++;
	}
}
