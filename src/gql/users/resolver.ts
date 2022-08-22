import { IContext } from 'gql/context';
import { authentication, authorization } from 'middleware';
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql';
import { User } from './schema';

@Resolver(() => User)
export class UsersResolver {
	@UseMiddleware(authentication, authorization(['user']))
	@Query(() => User, { nullable: true })
	async me(@Ctx() { identity, db }: IContext): Promise<User> {
		return (await db.users.findFirst({ where: { id: identity.id } })) as User;
	}
}
