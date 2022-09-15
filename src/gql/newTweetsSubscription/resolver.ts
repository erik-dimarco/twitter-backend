import { PrismaClient } from '@prisma/client';
import { UserTweetResponse } from 'gql/tweets/schema';
import { User } from 'gql/users/schema';
import { Resolver, Root, Subscription } from 'type-graphql';
import { UserTweetSubscription } from './schema';

@Resolver(() => UserTweetSubscription)
export class NewTweetsSubscriptionResolver {
	// ...
	@Subscription(() => UserTweetSubscription, {
		topics: 'NEW_TWEET'
		// TODO: filter out tweets that are not for the user
		// filter: ({ payload, args }) => {
		// 	return payload.userId === args.userId;
		// },
	})
	async newTweet(@Root() tweetsPayload: UserTweetResponse): Promise<UserTweetSubscription> {
		// TODO: See if there is a way to avoid creating a new instance of the db
		const db = new PrismaClient();

		const likesCount = await db.likes.count({ where: { tweetId: tweetsPayload.id } });
		const commentsCount = await db.comments.count({ where: { tweetId: tweetsPayload.id } });
		const user = (await db.users.findFirst({ where: { id: tweetsPayload.userId } })) as User;

		const tweet = {
			...tweetsPayload,
			likesCount,
			commentsCount,
			user
		};

		return tweet;
	}
}
