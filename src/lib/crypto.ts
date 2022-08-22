import crypto from 'crypto';

import config from 'config';

const algorithm = 'aes-128-ctr';
const secretKey = config.crypto.aesSecretKey;

export const encrypt = (text: string): string => {
	const iv = crypto.randomBytes(16);
	const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey as string), iv);

	const encrypted = Buffer.concat([iv, cipher.update(text), cipher.final()]);

	const encoded = encrypted.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

	return encoded;
};

export const decrypt = (text: string): string => {
	const decoded = text
		.replace(/-/g, '+')
		.replace(/_/g, '/')
		.padEnd(3 - (text.length % 3), '=');

	const buffer = Buffer.from(decoded, 'base64');
	const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey as string), buffer.slice(0, 16));

	const decrypted = Buffer.concat([decipher.update(buffer.slice(16)), decipher.final()]);
	return decrypted.toString();
};
