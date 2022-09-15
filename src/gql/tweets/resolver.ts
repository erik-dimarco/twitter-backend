import { TweetType } from '@prisma/client';
import { IContext } from 'gql/context';
import { UserTweetLike } from 'gql/likes/schema';
import { User } from 'gql/users/schema';
import { authentication, authorization } from 'middleware';
import { Arg, Args, Ctx, FieldResolver, Mutation, Publisher, PubSub, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { CreateTweetInput, LikedTweetsInput, TweetsInput, UserTweetResponse } from './schema';

@Resolver(() => UserTweetResponse)
export class TweetsResolver {
	@UseMiddleware(authentication, authorization(['user']))
	@Query(() => [UserTweetResponse])
	async tweets(@Args() { filterByUser, userId }: TweetsInput, @Ctx() { db, identity }: IContext): Promise<UserTweetResponse[]> {
		if (filterByUser && userId) {
			return await db.tweets.findMany({
				where: { userId },
				orderBy: {
					createdAt: 'desc'
				}
			});
		}

		if (filterByUser && !userId) {
			return await db.tweets.findMany({
				where: { userId: identity.id },
				orderBy: {
					createdAt: 'desc'
				}
			});
		}

		return await db.tweets.findMany({
			orderBy: {
				createdAt: 'desc'
			}
		});
	}

	@UseMiddleware(authentication, authorization(['user']))
	@Query(() => [UserTweetResponse])
	async likedTweets(@Args() { userId }: LikedTweetsInput, @Ctx() { db }: IContext): Promise<UserTweetResponse[]> {
		const likedTweets = await db.likes.findMany({ where: { userId }, include: { tweet: true } });

		console.log({ likedTweets });
		console.log({ likedTweets: likedTweets.map(like => like.tweet) });

		return likedTweets.map(({ tweet }) => tweet);
	}

	@FieldResolver()
	async didLike(@Root() { id }: UserTweetResponse, @Ctx() { db, identity }: IContext): Promise<boolean> {
		const likedTweet = await db.likes.findFirst({ where: { tweetId: id, userId: identity.id } });

		return likedTweet ? true : false;
	}

	@FieldResolver()
	async likesCount(@Root() { id }: UserTweetResponse, @Ctx() { db }: IContext): Promise<number> {
		return await db.likes.count({ where: { tweetId: id } });
	}

	@FieldResolver(() => [UserTweetLike])
	async likes(@Root() { id }: UserTweetResponse, @Ctx() { db }: IContext): Promise<UserTweetLike[]> {
		return await db.likes.findMany({ where: { tweetId: id } });
	}

	@FieldResolver()
	async commentsCount(@Root() { id }: UserTweetResponse, @Ctx() { db }: IContext): Promise<number> {
		return await db.comments.count({ where: { tweetId: id } });
	}

	@FieldResolver(() => User)
	async user(@Root() { userId }: UserTweetResponse, @Ctx() { db }: IContext): Promise<User> {
		return (await db.users.findFirst({ where: { id: userId } })) as User;
	}

	@UseMiddleware(authentication, authorization(['user']))
	@Mutation(() => UserTweetResponse)
	async createTweet(
		@Arg('input') { caption, type = TweetType.tweet }: CreateTweetInput,
		@Ctx() { db, identity }: IContext,
		@PubSub('NEW_TWEET') publish: Publisher<UserTweetResponse>
	): Promise<UserTweetResponse> {
		const newTweet = await db.tweets.create({
			data: {
				caption,
				type,
				userId: identity.id
			}
		});

		// Handle pushing tweet to followers
		await publish(newTweet);

		return newTweet;
	}
}
