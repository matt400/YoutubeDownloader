import * as path from 'path';
import * as express from 'express';
import * as helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';

import { CWeb } from '../lib/types/server';
import { isDev, APP_ENV_DIR } from '../lib/utils/path';

/* Controllers */
import * as AuthController from './routes/AuthController';
import * as DownloadController from './routes/DownloadController';

export default class Web implements CWeb {
	public readonly PORT: number = 3000;
	public db: any;
	public app: Express.Application;
	public sessionStore: any;

	constructor(db: any, sessionStore: any) {
		this.db = db;
		this.sessionStore = sessionStore;
	}

	init(): void {
		const app: any = express();

		app.set('trust proxy', 1);
		app.use(helmet());
		app.use(session({
			store: new this.sessionStore,
			secret: 'keyboard cat',
			saveUninitialized: true,
			resave: true
		}));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(express.static(APP_ENV_DIR));

		app.get('/', (req: any, res: any) => {
			const hour = 60 * 60 * 1000;
			req.session.cookie.expires = new Date(Date.now() + hour);
			req.session.cookie.maxAge = hour;
			res.sendFile(path.join(APP_ENV_DIR, 'index.html'));
		});

		app.listen(this.PORT, "0.0.0.0");

		// Routes
		app.use('/auth', AuthController);
		app.use('/download', DownloadController);

		app.locals.db = this.db;
		this.app = app;
	}
}
