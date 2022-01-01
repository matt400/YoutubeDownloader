import * as path from 'path';

export const isDev: boolean = (process.env['NODE_ENV'] === 'development') ? true : false;
export const CACHE_DIR: string =  path.resolve(__dirname, '../../cache/');
export const MIG_DIR: string =  path.resolve(__dirname, '../../migrations/');
export const DB_FILE: string =  path.resolve(__dirname, '../../server.db');
export const DB_WAL: string =  path.resolve(__dirname, '../../server.db-wal');
export const WRAPPER_FILE: string = path.resolve(__dirname, '../../wrapper.py');
export const APP_ENV_DIR: string = (isDev) ? path.join(__dirname, '../../ui/build') : path.join(__dirname, '../../ui');
