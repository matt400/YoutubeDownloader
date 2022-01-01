import * as events from 'events';

import { currentUnix } from '../../lib/utils/utils';
import { DEBUG_SESSION_STORE } from '../../lib/utils/debug';

/**
 * @type {Integer}  One hour in milliseconds.
 */
const oneHour: number = 3600000;

/**
 * @param  {any} db
 * @param  {any} session
 */
const BSQL3Store = function(db: any, session: any) {
	const Store = session.Store;

	function dbCleanup(tableName: string) {
		db.removeEntry(tableName, { expired: [currentUnix(), '<'] });
	}

	class BSqlite3 extends Store {
		private table: any;
		private db: any;
		private client: any;

		constructor() {
			super();
			let options: any;
			options = options || {};

			Store.call(this, options);

			this.table = options.table || 'sessions';
			this.db = options.db || this.table;
			this.client = new events.EventEmitter();

			// create table
			setInterval(dbCleanup.bind(null, 'sessions'), oneHour, this).unref();
		}

		get = function(sid: string, cb: Function): void {
			const result = db.selectSpecificColumns(['sess'], 'sessions', {
				sid: sid,
				expired: [currentUnix(), '>=']
			});
			DEBUG_SESSION_STORE('get() -> %O', result);
			cb(null, JSON.parse(result.sess || 'null'));
		}

		set = function(sid: string, sess: any, cb: Function): void {
			const maxAge = sess.cookie.maxAge;
			const expired = maxAge ? currentUnix(Date.now() + maxAge) : currentUnix(Date.now() + oneHour);
			sess = JSON.stringify(sess);

			db.insertValues('sessions', {
				sid: sid,
				expired: expired,
				sess: sess
			}, true);
			DEBUG_SESSION_STORE('set() -> %O', { sid: sid, expired: expired, sess: sess });
			if(cb) cb(null, sid, expired, sess);
		}

		destroy = function(sid: string, cb: Function): void {
			db.removeEntry('sessions', { sid: sid });
			DEBUG_SESSION_STORE('destroy() -> %s', sid);
			cb(null, true);
		}

		length = function(cb: Function): void {
			const result = db.getNumberOfRecords('sessions');
			DEBUG_SESSION_STORE('length() -> %s', result);
			cb(null, result.count);
		}

		clear = function(cb: Function): void {
			db.cleanTable('sessions');
			DEBUG_SESSION_STORE('clear()');
			cb(null, true);
		}

		touch = function(sid: string, session: any, cb: Function): void {
			if (session && session.cookie && session.cookie.expires) {
				const cookieExpires = currentUnix(session.cookie.expires);
				db.updateValues('sessions', {
					expired: cookieExpires
				}, {
					sid: sid,
					expired: [currentUnix(), '>=']
				});
				DEBUG_SESSION_STORE('touch() -> cookieExpires: %s', cookieExpires);
				cb(null, true);
			} else {
				DEBUG_SESSION_STORE('touch()');
				cb(null, true);
			}
		}
	}

	return BSqlite3;
};

export { BSQL3Store };
