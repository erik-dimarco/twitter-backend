import { TimeStamps } from 'types/util';
import { Field, ID, ObjectType, Int, InputType, ArgsType } from 'type-graphql';

@ObjectType()
export class UserTweetLike extends TimeStamps {
	@Field(() => ID)
	id: string;

	@Field(() => ID)
	userId: string;

	@Field(() => ID)
	tweetId: string;

	@Field(() => ID, { nullable: true })
	commentId?: string | null;
}

@InputType()
export class LikeTweetInput {
	@Field(() => ID)
	tweetId: string;

	@Field(() => ID, { nullable: true })
	commentId?: string;
}

// @ArgsType()
// export class TweetsInput {
// 	@Field({ nullable: true })
// 	filterByUser?: boolean;

// 	@Field(() => ID, { nullable: true })
// 	userId?: string;
// }

// @ObjectType()
// export class UserTweetResponse extends UserLike {
// 	@Field(() => Int)
// 	likesCount?: number;

// 	@Field(() => Int)
// 	commentsCount?: number;

// 	@Field(() => User)
// 	user?: User;
// }
