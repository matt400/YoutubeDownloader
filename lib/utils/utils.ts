import * as fs from 'fs';

export function currentUnix(customTime?: Date | number): number {
	return (customTime === undefined) ? +new Date / 1000 | 0 : +new Date(customTime) / 1000 | 0;
}

export async function checkIfFileExists(path: string) {
	let FH: any;
	try {
		FH = await fs.promises.open(path, "r");
	} finally {
		if (FH !== undefined) {
			await FH.close();
			return true;
		} else {
			return false;
		}
	}
}

export function formatBytes(bytes: number, decimals: number): string {
	if(bytes == 0) return '0 Bytes';

	let k = 1024;
	let dm = decimals <= 0 ? 0 : decimals || 2;
	let sizes = ['Bytes', 'KB', 'MB', 'GB'];
	let i = Math.floor(Math.log(bytes) / Math.log(k));
	
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
