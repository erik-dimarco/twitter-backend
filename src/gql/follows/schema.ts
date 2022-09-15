import { TimeStamps } from 'types/util';
import { Field, ID, InputType, Int, ObjectType } from 'type-graphql';
import 'reflect-metadata';
import { User } from 'gql/users/schema';

@ObjectType()
export class Follow extends TimeStamps {
	@Field(() => ID)
	id: string;

	@Field(() => ID)
	followerId: string;

	@Field(() => User)
	follower?: User;

	@Field(() => User)
	followed?: User;

	@Field(() => ID)
	followedId: string;
}

@InputType()
export class FollowInput {
	@Field(() => ID)
	followedId: string;
}

@InputType()
export class FollowersInput {
	@Field(() => ID)
	followerId: string;
}

@ObjectType()
export class FollowStats {
	@Field(() => Int)
	followers: number;

	@Field(() => Int)
	following: number;
}
