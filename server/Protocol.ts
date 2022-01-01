import * as WebSocket from 'ws';
import * as Database from 'better-sqlite3';
import * as jwt from 'jsonwebtoken';

import { DEBUG_PROTOCOL } from '../lib/utils/debug';

const secret = "Ajskn5K6p6k41ANn9kAQuy1op";

export function sendUserMessage(ws: WebSocket, buffer: Array<any>): void {
	// do something if not
	if(ws.readyState === ws.OPEN) {
		const buf = Buffer.from(JSON.stringify(buffer));
		ws.send(buf);
	}
}

export const clientVerification = function(db: Database, info: any, cb: Function): void {
	const url: string = info.req.url;
	const params: string = url.slice(2);
	const urlParams: URLSearchParams = new URLSearchParams(params);

	if(!urlParams.has('access_token')) {
		cb(false, 401, 'Unauthorized');
	}

	const accessToken: string = encodeURIComponent(urlParams.get('access_token'));

	jwt.verify(accessToken, secret, (err: Error, decoded: any) => {
		if (err) {
			cb(false, 401, 'Unauthorized');
		} else {
			// if token expired return fail
			DEBUG_PROTOCOL('clientVerification() -> jwt.verify decoded: %O', decoded);
			info.req.userIP = decoded.user_ip;
			cb(true);
		}
	});
}
