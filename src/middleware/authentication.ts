import { decode } from 'lib/tokens';
import { IncomingHttpHeaders } from 'http';
import { NextFn } from 'type-graphql';
import { InvalidHeaderError } from 'lib/errors';

export function getTokenFromHeaders(headers: IncomingHttpHeaders): string {
	const { authorization: authHeader } = headers;
	const authorizationToken = authHeader ? authHeader.split(' ')[1] : null;

	if (!authorizationToken) {
		throw InvalidHeaderError;
	}

	return authorizationToken;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default ({ context }: any, next: NextFn): Promise<any> => {
	const { authorization } = context;
	const token = getTokenFromHeaders({ authorization });

	context.identity = decode(token);

	return next();
};
