import { TimeStamps } from 'types/util';
import { Field, ID, InputType, ObjectType } from 'type-graphql';
import 'reflect-metadata';

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

@InputType()
export class CreateUserInput {
	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	email: string;
}
