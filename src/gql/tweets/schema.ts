import { TimeStamps } from 'types/util';
import { Field, ID, ObjectType, Int, InputType, ArgsType } from 'type-graphql';
import { TweetType } from '@prisma/client';
import { User } from 'gql/users/schema';
import { UserTweetLike } from 'gql/likes/schema';

@ObjectType()
export class UserTweet extends TimeStamps {
	@Field(() => ID)
	id: string;

	@Field(() => ID)
	userId: string;

	@Field()
	caption: string;

	@Field(() => String)
	type: TweetType; // tweet | retweet
}

@InputType()
export class CreateTweetInput {
	@Field()
	caption: string;

	@Field(() => String, { nullable: true })
	type?: TweetType;
}

@ArgsType()
export class TweetsInput {
	@Field({ nullable: true })
	filterByUser?: boolean;

	@Field(() => ID, { nullable: true })
	userId?: string;
}

@ArgsType()
export class LikedTweetsInput {
	@Field(() => ID)
	userId: string;
}

@ObjectType()
export class UserTweetResponse extends UserTweet {
	@Field(() => Int)
	likesCount?: number;

	@Field(() => Int)
	commentsCount?: number;

	@Field(() => [UserTweetLike])
	likes?: UserTweetLike[];

	@Field(() => User)
	user?: User;

	@Field()
	didLike?: boolean;
}
