import * as express from 'express';

import { compressedFilePath } from '../../lib/utils/server';

const router = express.Router();

router.get('/:sid', (req: any, res: any) => {
	const db = req.app.locals.db;

	// defend against sql injection, sanitize req.params.sid
	if(req.params.sid.length < 24) {
		res.status(404).send('Sorry, we cannot find that!');
		return;
	}

	const query = db.selectSpecificColumns(['video_id', 'quality', 'format', 'real_name'], 'compressed_files', {
		sid: req.params.sid
	});

	if(query) {
		const actualFile = compressedFilePath(query.video_id, query.quality, query.format);
		const abstractFile = query.real_name + '.' + query.format;
		res.download(actualFile, abstractFile);
	} else {
		res.status(404).send('Sorry, we cannot find that!');
	}
});

export = router;
