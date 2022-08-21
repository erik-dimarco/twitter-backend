export type IContext = {
	env: string;
	authorization: string;
	identity: any;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default ({ req }: any): any => {
	return {
		authorization: req.header('Authorization'),
		env: process.env.NODE_ENV,
		identity: req.identity
	};
};
