import * as fs from 'fs';
import * as Database from 'better-sqlite3';
import * as session from 'express-session';

import { DB_FILE, DB_WAL } from '../lib/utils/path';
import { BSQL3 } from '../lib/db/bsql3';
import { BSQL3Store } from './session/store_bsql3';

export default class DB {
	private db: Database;
	private sessionDriver: any;

	constructor() {
		// future driver types
		const db = new Database(DB_FILE);
		db.pragma('journal_mode = WAL');

		setInterval(fs.stat.bind(null, DB_WAL, (err: { code: string }, stat: { size: string }) => {
			if(err) {
				if (err.code !== 'ENOENT') throw err;
			} else if (stat.size > '81920') { // 80KB
				db.checkpoint();
			}
		}), 10000);

		this.db = BSQL3(db);
		this.sessionDriver = BSQL3Store(this.db, session);
	}

	get _db() {
		return this.db;
	}

	get _sessionDriver() {
		return this.sessionDriver;
	}
}
