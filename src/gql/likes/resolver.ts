import { TweetType } from '@prisma/client';
import { IContext } from 'gql/context';
import { OperationSuccess, User } from 'gql/users/schema';
import { authentication, authorization } from 'middleware';
import { Arg, Args, Ctx, FieldResolver, Mutation, Publisher, PubSub, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { UserTweetLike, LikeTweetInput } from './schema';

@Resolver(() => UserTweetLike)
export class LikesResolver {
	// @UseMiddleware(authentication, authorization(['user']))
	// @Query(() => [UserTweetResponse])
	// async tweets(@Args() { filterByUser, userId }: TweetsInput, @Ctx() { db, identity }: IContext): Promise<UserTweetResponse[]> {
	// 	if (filterByUser && userId) {
	// 		return await db.tweets.findMany({
	// 			where: { userId },
	// 			orderBy: {
	// 				createdAt: 'desc'
	// 			}
	// 		});
	// 	}

	// 	if (filterByUser && !userId) {
	// 		return await db.tweets.findMany({
	// 			where: { userId: identity.id },
	// 			orderBy: {
	// 				createdAt: 'desc'
	// 			}
	// 		});
	// 	}

	// 	return await db.tweets.findMany({
	// 		orderBy: {
	// 			createdAt: 'desc'
	// 		}
	// 	});
	// }

	// @FieldResolver()
	// async likesCount(@Root() { id }: UserTweetResponse, @Ctx() { db }: IContext): Promise<number> {
	// 	return await db.likes.count({ where: { tweetId: id } });
	// }

	// @FieldResolver()
	// async commentsCount(@Root() { id }: UserTweetResponse, @Ctx() { db }: IContext): Promise<number> {
	// 	return await db.comments.count({ where: { tweetId: id } });
	// }

	// @FieldResolver(() => User)
	// async user(@Root() { userId }: UserTweetResponse, @Ctx() { db }: IContext): Promise<User> {
	// 	return (await db.users.findFirst({ where: { id: userId } })) as User;
	// }

	@UseMiddleware(authentication, authorization(['user']))
	@Mutation(() => UserTweetLike)
	async likeTweet(@Arg('input') { tweetId, commentId }: LikeTweetInput, @Ctx() { db, identity }: IContext): Promise<UserTweetLike> {
		const like = await db.likes.create({
			data: {
				userId: identity.id,
				tweetId,
				commentId
			}
		});

		return like;
	}

	@UseMiddleware(authentication, authorization(['user']))
	@Mutation(() => OperationSuccess)
	async unlikeTweet(@Arg('input') { tweetId, commentId }: LikeTweetInput, @Ctx() { db, identity }: IContext): Promise<OperationSuccess> {
		const like = await db.likes.findFirst({
			where: {
				userId: identity.id,
				tweetId,
				commentId
			}
		});

		if (!like) {
			return {
				success: false
			};
		}

		await db.likes.delete({
			where: {
				id: like.id
			}
		});

		return { success: true };
	}
}
