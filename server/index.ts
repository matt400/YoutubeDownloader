import * as path from 'path';
import * as fs from 'fs';
import * as Database from 'better-sqlite3';

import Server from "./Server";
import { CACHE_DIR, DB_FILE, MIG_DIR, WRAPPER_FILE } from '../lib/utils/path';

if(!fs.existsSync(WRAPPER_FILE)) {
	throw "ERROR: wrapper.py not exists in root directory!";
}

if(!fs.existsSync(CACHE_DIR)) {
	fs.mkdirSync(CACHE_DIR);
}

if(!fs.existsSync(DB_FILE)) {
	const db = new Database(DB_FILE);
	const common = fs.readFileSync(path.join(MIG_DIR, "server.sql"), 'utf8');
	db.pragma('journal_mode = WAL');
	db.exec(common);
	db.close();
}

new Server();
