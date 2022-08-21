import { Query, Resolver } from 'type-graphql';
import { User } from './schema';

@Resolver(() => User)
export class UsersResolver {
	@Query(() => User)
	user(): User {
		return { id: '1', firstName: 'John', lastName: 'Doe', email: 'test@gmail.com' };
	}
}
