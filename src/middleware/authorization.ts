import { MiddlewareFn } from 'type-graphql';
import { InvalidRoleError } from 'lib/errors';

import { IContext } from '../gql/context';
import { UserRole } from '../types/userRole';

/**
 * Authorization decorator middleware for typeGraphQL:
 * @param roles An array of strings representing the roles that the user should have
 */
export default function authorization(roles: UserRole[]): MiddlewareFn<IContext> {
	return ({ context }, next) => {
		if (!roles.includes(context.identity.role)) {
			throw InvalidRoleError;
		}
		return next();
	};
}
