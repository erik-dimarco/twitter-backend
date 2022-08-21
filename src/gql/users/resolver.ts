import { IContext } from 'gql/context';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { CreateUserInput, User } from './schema';

@Resolver(() => User)
export class UsersResolver {
	@Query(() => User)
	user(): User {
		return { id: '1', firstName: 'John', lastName: 'Doe', email: 'test@gmail.com' };
	}

	@Mutation(() => User)
	async createUser(@Arg('input') { firstName, lastName, email }: CreateUserInput, @Ctx() { prisma, identity }: IContext): Promise<User> {
		return await prisma.user.create({
			data: {
				firstName,
				lastName,
				email
			}
		});
	}
}
