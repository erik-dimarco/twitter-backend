import { Query, Resolver } from 'type-graphql';
import { UserTweets } from './schema';

@Resolver(() => UserTweets)
export class UserTweetsResolver {
	@Query(() => [UserTweets])
	userTweets(): UserTweets[] {
		return [
			{ id: '1', userId: '1', tweet: 'Hello World' },
			{ id: '2', userId: '1', tweet: 'Hello World 2' }
		];
	}
}
