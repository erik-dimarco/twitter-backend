import { TimeStamps } from 'types/util';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class UserTweets extends TimeStamps {
	@Field(() => ID)
	id: string;

	@Field(() => ID)
	userId: string;

	@Field()
	tweet: string;
}
