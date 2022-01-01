import * as Database from 'better-sqlite3';
import { DB_PATH } from '../server/common/utils'

class Bot {
	private db: any;

	constructor() {
		const db = new Database(DB_PATH);
		db.pragma('journal_mode = WAL');

		this.db = db;
	}

	init() {}
}