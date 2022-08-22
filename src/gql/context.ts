import { PrismaClient } from '@prisma/client';

export type IContext = {
	env: string;
	authorization: string;
	identity: any;
	db: PrismaClient;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default ({ req }: any): any => {
	/* eslint-disable @typescript-eslint/ban-ts-comment */

	let db: PrismaClient;
	if (process.env.NODE_ENV === 'production') {
		db = new PrismaClient();
		console.log('Production: Created DB connection.');
	} else {
		// @ts-ignore
		if (!global.db) {
			// @ts-ignore
			global.db = new PrismaClient();
			console.log('Development: Created DB connection.');
		}

		// @ts-ignore
		db = global.db;
	}

	return {
		authorization: req.header('Authorization'),
		env: process.env.NODE_ENV,
		identity: req.identity,
		db
	};
};
