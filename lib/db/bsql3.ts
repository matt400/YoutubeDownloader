import * as Database from 'better-sqlite3';
import { DEBUG_BSQL3 } from '../utils/debug';

function prepareCommaValues(clause: object, separator: string, markerKey?: string): { clause: string, values: Array<string> } {
	const clauseOKeys = Object.keys(clause);
	const clauseOValues = (<any>Object).values(clause);
	let clauseValues: string[] = [];

	const sep = (separator === 'AND' || separator === 'OR') ? ` ${separator}` : separator;
	
	const endClause = clauseOKeys.map((currentValue: string, index: number) => {
		const valuesType = typeof clauseOValues[index];

		const operator = (valuesType === 'object') ? clauseOValues[index][1] : '=';
		const marker = (markerKey === undefined || markerKey === null) ? `?` : `${markerKey}${currentValue}`;

		if(valuesType === 'object') {
			clauseValues.push(clauseOValues[index][0]);
		} else {
			clauseValues.push(clauseOValues[index])
		}

		return (index < clauseOKeys.length - 1) ? `${currentValue}${operator}${marker}${sep}` : `${currentValue}${operator}${marker}`;
	}).join(' ');

	return { clause: endClause, values: clauseValues };
}

const BSQL3 = function(db: Database) {
	const module: any = {};

	module.checkIfRecordExists = (tableName: string, where: object): boolean => {
		const whereClause = prepareCommaValues(where, 'AND');

		DEBUG_BSQL3('SELECT EXISTS(SELECT 1 FROM %s WHERE %s) AS found', tableName, whereClause.clause);

		try {
			const query = db.prepare(
				`SELECT EXISTS(SELECT 1 FROM ${tableName} WHERE ${whereClause.clause}) AS found`
			).get(whereClause.values);

			return (query.found) ? true : false;
		} catch(error) {
			throw error;
		}
	};

	module.getNumberOfRecords = (tableName: string): object => {
		try {
			const query = db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get();
			return { count: query.count };
		} catch(error) {
			throw error;
		}
	};

	module.selectSpecificColumns = (columns: Array<string>, tableName: string, where: object): object => {
		const selectClause = columns.join(', ');
		const whereClause = prepareCommaValues(where, 'AND');

		DEBUG_BSQL3('SELECT %s FROM %s WHERE %s', selectClause, tableName, whereClause.clause);

		try {
			const query = db.prepare(
				`SELECT ${selectClause} FROM ${tableName} WHERE ${whereClause.clause}`
			).get(whereClause.values);

			return { ...query };
		} catch(error) {
			throw error;
		}
	};

	module.insertValues = (tableName: string, columns: object, orReplace?: boolean): void => {
		const columnKeys = Object.keys(columns);
		const columnValues = (<any>Object).values(columns);

		const columnComma = columnKeys.join(', ');
		const valuesComma = '?, '.repeat(columnKeys.length).slice(0, -2);

		const orr = (orReplace === undefined || orReplace === false) ? ``: `OR REPLACE `;

		DEBUG_BSQL3('INSERT %sINTO %s(%s) VALUES (%s)', orr, tableName, columnComma, valuesComma);

		try {
			const query = db.prepare(`INSERT ${orr}INTO ${tableName}(${columnComma}) VALUES (${valuesComma})`);
			query.run(columnValues);
		} catch(error) {
			throw error;
		}
	};

	module.updateValues = (tableName: string, columns: object, where: object): void => {
		const setClause = prepareCommaValues(columns, ',', '@');
		const whereClause = prepareCommaValues(where, 'AND', ':');
		const run = Object.assign(columns, where);

		DEBUG_BSQL3('UPDATE %s SET %s WHERE %s', tableName, setClause.clause, whereClause.clause);

		try {
			const query = db.prepare(`UPDATE ${tableName} SET ${setClause.clause} WHERE ${whereClause.clause}`);
			query.run(run);
		} catch(err) {
			throw err;
		}
	};

	module.removeEntry = (tableName: string, where: object): void => {
		const whereClause = prepareCommaValues(where, 'AND');

		DEBUG_BSQL3('DELETE FROM %s WHERE %s', tableName, whereClause.clause);

		try {
			const query = db.prepare(`DELETE FROM ${tableName} WHERE ${whereClause.clause}`);
			query.run(whereClause.values);
		} catch(err) {
			throw err;
		}
	};

	module.cleanTable = (tableName: string): void => {
		try {
			const query = db.prepare(`DELETE FROM ${tableName}`);
			query.run();
		} catch(err) {
			throw err;
		}
	};

	return module;
};

export { BSQL3 };
