import * as path from 'path';

import { CACHE_DIR } from './path';

export enum UserCodes {
	AlreadyCompressing = 2,
	AlreadyDownloading = 3,
	ValidationFailed = 4,
	LastUserAction = 5,
	TooManyAttempts = 6,
	Downloading = 10,
	Compressing = 20,
	Finished = 30
}

export const FORM_TYPES = {
	"format_type": ["mp3", "mp4", "avi"],
	"codecs": ["libmp3lame", undefined, undefined],
	"quality": ["320", "192", "128", "64"],
}

export function M4AFilePath(id: string): string {
	return path.join(CACHE_DIR, id + ".m4a");
}

export function compressedFilePath(id: string, quality: string, format: string): string {
	return path.join(CACHE_DIR, id + '_' + quality + '.' + format);
}

export function sizeM(size: number): number {
	if(size <= 12 && size > 0) {
		return 5;
	} else if(size <= 30 && size >= 13) {
		return 15;
	} else if(size <= 80 && size >= 31) {
		return 30;
	} else if(size <= 120 && size >= 81) {
		return 40;
	} else if(size >= 121) {
		return 60;
	}
}
