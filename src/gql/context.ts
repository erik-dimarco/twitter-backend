import { PrismaClient } from '@prisma/client';

export type IContext = {
	env: string;
	authorization: string;
	identity: any;
	prisma: PrismaClient;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default ({ req }: any): any => {
	const prisma = new PrismaClient();

	return {
		authorization: req.header('Authorization'),
		env: process.env.NODE_ENV,
		identity: req.identity,
		prisma
	};
};
