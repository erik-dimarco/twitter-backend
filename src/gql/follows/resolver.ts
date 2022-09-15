import { ApolloError } from 'apollo-server-express';
import { IContext } from 'gql/context';
import { User } from 'gql/users/schema';
import { authentication, authorization } from 'middleware';
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql';
import { Follow, FollowInput, FollowStats } from './schema';

@Resolver(() => Follow)
export class FollowsResolver {
	@UseMiddleware(authentication, authorization(['user']))
	@Query(() => [Follow])
	async followers(@Ctx() { identity, db }: IContext): Promise<Follow[]> {
		console.log('user', identity);

		return await db.follows.findMany({
			where: {
				followedId: identity.id
			}
		});
	}

	@UseMiddleware(authentication, authorization(['user']))
	@Query(() => [Follow])
	async following(@Ctx() { identity, db }: IContext): Promise<Follow[]> {
		console.log('user', identity);

		return await db.follows.findMany({
			where: {
				followerId: identity.id
			}
		});
	}

	@UseMiddleware(authentication, authorization(['user']))
	@Query(() => FollowStats)
	async followStats(@Ctx() { identity, db }: IContext): Promise<FollowStats> {
		const followers = await db.follows.count({
			where: {
				followedId: identity.id
			}
		});

		const following = await db.follows.count({
			where: {
				followerId: identity.id
			}
		});

		return {
			followers,
			following
		};
	}

	@FieldResolver()
	async follower(@Root() @Ctx() { db }: IContext, { followerId }: Follow): Promise<User> {
		return (await db.users.findFirst({ where: { id: followerId } })) as User;
	}

	@FieldResolver()
	async followed(@Root() @Ctx() { db }: IContext, { followedId }: Follow): Promise<User> {
		return (await db.users.findFirst({ where: { id: followedId } })) as User;
	}

	@UseMiddleware(authentication, authorization(['user']))
	@Mutation(() => Follow)
	async follow(
		@Arg('input')
		{ followedId }: FollowInput,
		@Ctx() { identity, db }: IContext
	): Promise<Follow> {
		// Check if user is already following
		const existingFollow = await db.follows.findFirst({
			where: {
				followedId,
				followerId: identity.id
			}
		});

		if (existingFollow) {
			throw new ApolloError('User is already following');
		}

		// Check if user is trying to follow themselves
		if (followedId === identity.id) {
			throw new ApolloError('Unable to follow yourself');
		}

		return await db.follows.create({
			data: {
				followedId,
				followerId: identity.id
			}
		});
	}

	// @UseMiddleware(authentication, authorization(['user']))
	// @Mutation(() => Follow)
	// async unfollow(
	// 	@Arg('input')
	// 	{ followedId }: FollowInput,
	// 	@Ctx() { identity, db }: IContext
	// ): Promise<Follow> {
	// 	// Make sure user is following
	// 	const existingFollow = await db.follows.findFirst({
	// 		where: {
	// 			followedId,
	// 			followerId: identity.id
	// 		}
	// 	});

	// 	if (!existingFollow) {
	// 		throw new ApolloError('You must be following to unfollow');
	// 	}

	// 	return await db.follows.delete({
	// 		where: {
	// 			followedId,
	// 			followerId: identity.id
	// 		}
	// 	});
	// }
}
