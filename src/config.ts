function int(str: string | undefined, radix?: number) {
	if (str === undefined) {
		return undefined;
	}

	return parseInt(str, radix);
}

export default {
	server: {
		port: int(process.env.APP_PORT) || 4000,
		path: '/graphql'
	},
	jwt: {
		userExpiresIn: int(process.env.JWT_USER_EXPIRES_IN) || 604800, // 1 week
		secret: process.env.JWT_SECRET || 'twitter-secret'
	},
	aws: {
		accessKey: process.env.NODE_ENV !== 'test' ? process.env.AWS_APP_ACCESS_KEY_ID : '',
		secretAccessKey: process.env.NODE_ENV !== 'test' ? process.env.AWS_APP_SECRET_ACCESS_KEY : '',
		s3: {
			// Expiration is 86400 seconds aka 24 hours
			secondsTilExpiration: int(process.env.S3_SIGNED_EXPIRATION) || 86400
		}
	}
};