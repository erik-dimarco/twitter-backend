import jwt from 'jsonwebtoken';
import config from 'config';
import { unauthorized } from 'boom';
import logger from 'lib/logger';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function encode(payload: any, expiresInSeconds: number): string {
	const expiresIn = expiresInSeconds || config.jwt.userExpiresIn;
	const options: jwt.SignOptions = { expiresIn };
	return jwt.sign(payload, config.jwt.secret, options);
}

export function decode(token: string): any {
	try {
		return jwt.verify(token, config.jwt.secret);
	} catch (error) {
		logger.error(error);
		throw unauthorized('Invalid Token');
	}
}
