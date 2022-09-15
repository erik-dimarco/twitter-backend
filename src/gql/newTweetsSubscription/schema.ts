import { TweetType } from '@prisma/client';
import { UserTweetLike } from 'gql/likes/schema';
import { User } from 'gql/users/schema';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { TimeStamps } from 'types/util';

@ObjectType()
export class UserTweetSubscription extends TimeStamps {
	@Field(() => ID)
	id: string;

	@Field(() => ID)
	userId: string;

	@Field()
	caption: string;

	@Field(() => String)
	type: TweetType; // tweet | retweet

	@Field(() => Int)
	likesCount?: number;

	@Field(() => Int)
	commentsCount?: number;

	@Field(() => User)
	user?: User;
}
