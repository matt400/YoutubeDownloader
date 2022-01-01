import * as express from 'express';
import * as jwt from 'jsonwebtoken';

const router = express.Router();
const secret = "Ajskn5K6p6k41ANn9kAQuy1op";

router.post('/authorization', (req: any, res: any) => {
	const db = req.app.locals.db;
	const sid = req.session.id;
	const userIP = req.connection.remoteAddress;

	const accessToken = jwt.sign({
		session_id: sid,
		user_ip: userIP
	}, secret, { expiresIn: '1h' });

	res.send({ auth: true, token: accessToken });
	res.end();
});

function verifyToken(req: any, res: any, next: any) {
	const db = req.app.locals.db;
	const token = req.headers['X-Access-Token'];
	if (!token) {
		return res.status(401).send({ auth: false, token: 'No token provided.' });
	}

	jwt.verify(token, secret, (err: Error, decoded: any) => {
		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
		
		// if token expired return fail
		req.userIP = decoded.user_ip;
    next();
	});
}

router.get('/me', verifyToken, (req: any, res: any) => {
	res.status(200).send("OK");
});

export = router;
