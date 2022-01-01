import * as debug from 'debug';

export const DEBUG_SERVER = debug('Server');
export const DEBUG_PROTOCOL = DEBUG_SERVER.extend('Protocol');
export const DEBUG_BSQL3 = DEBUG_SERVER.extend('better-sqlite3');
export const DEBUG_SESSION_STORE = DEBUG_SERVER.extend('BSQL3Store');
