import { TimeStamps } from 'types/util';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class User extends TimeStamps {
	@Field(() => ID)
	id: string;

	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	email: string;
}
