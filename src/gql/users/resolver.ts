import { PrismaClient } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';
import { IContext } from 'gql/context';
import { authentication, authorization } from 'middleware';
import { Arg, Args, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { OperationSuccess, SearchInput, SaveProfileImageInput, SaveProfileImageResponse, SaveUsernameInput, User, UsersResponse } from './schema';

@Resolver(() => User)
export class UsersResolver {
	@UseMiddleware(authentication, authorization(['user']))
	@Query(() => User, { nullable: true })
	async me(@Ctx() { identity, db }: IContext): Promise<User> {
		console.log('identity', identity);
		return (await db.users.findFirst({ where: { id: identity.id } })) as User;
	}

	@Query(() => UsersResponse)
	@UseMiddleware(authentication, authorization(['user']))
	async users(@Args() { searchTerm, cursor }: SearchInput, @Ctx() { db }: IContext): Promise<UsersResponse> {
		const users = await this._userSearch(searchTerm, cursor, db);

		if (users.length === 0) {
			return {
				users: [],
				pagination: {
					hasMoreResults: false
				}
			};
		}

		return {
			users,
			pagination: {
				hasMoreResults: users.length === 25,
				cursor: users[users.length - 1].id
			}
		};
	}

	@UseMiddleware(authentication, authorization(['user']))
	@Mutation(() => SaveProfileImageResponse)
	async saveProfileImage(
		@Arg('input')
		{ profileImage }: SaveProfileImageInput,
		@Ctx() { db, identity }: IContext
	): Promise<SaveProfileImageResponse> {
		const updatedUser = await db.users.update({
			where: {
				id: identity.id
			},
			data: {
				profileImage
			}
		});

		return {
			profileImage: updatedUser.profileImage ?? ''
		};
	}

	@UseMiddleware(authentication, authorization(['user']))
	@Mutation(() => OperationSuccess)
	async saveUsername(
		@Arg('input')
		{ username }: SaveUsernameInput,
		@Ctx() { db, identity }: IContext
	): Promise<OperationSuccess> {
		// Check if username is already taken
		const usernameExists = await db.users.findFirst({
			where: {
				username
			}
		});

		if (usernameExists) {
			throw new ApolloError('Username already taken', 'USERNAME_EXISTS');
		}

		const saveUsername = await db.users.update({
			where: {
				id: identity.id
			},
			data: {
				username
			}
		});

		return {
			success: saveUsername ? true : false
		};
	}

	private async _userSearch(searchTerm: string | undefined, cursor: string | undefined, db: PrismaClient): Promise<User[]> {
		if (cursor && searchTerm) {
			const users = await db.users.findMany({
				take: 25,
				cursor: {
					id: cursor
				},
				where: {
					OR: [
						{ firstName: { contains: searchTerm, mode: 'insensitive' } },
						{ lastName: { contains: searchTerm, mode: 'insensitive' } },
						{ username: { contains: searchTerm, mode: 'insensitive' } },
						{ email: { contains: searchTerm, mode: 'insensitive' } }
					]
				}
			});

			return users;
		}

		if (!cursor && searchTerm) {
			const users = await db.users.findMany({
				take: 25,
				where: {
					OR: [
						{ firstName: { contains: searchTerm, mode: 'insensitive' } },
						{ lastName: { contains: searchTerm, mode: 'insensitive' } },
						{ username: { contains: searchTerm, mode: 'insensitive' } },
						{ email: { contains: searchTerm, mode: 'insensitive' } }
					]
				}
			});

			return users;
		}

		if (cursor && !searchTerm) {
			const users = await db.users.findMany({
				take: 25,
				cursor: {
					id: cursor
				}
			});

			return users;
		} else {
			const users = await db.users.findMany({
				take: 25
			});

			return users;
		}
	}
}
