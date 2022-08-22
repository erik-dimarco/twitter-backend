import { TimeStamps } from 'types/util';
import { Field, ID, InputType, ObjectType } from 'type-graphql';
import 'reflect-metadata';
import { UserRole } from 'types/userRole';

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

	@Field()
	hashedPassword: string;

	@Field(() => String)
	role: UserRole;

	@Field()
	lastLogin: Date;
}

@ObjectType()
export class OperationSuccess {
	@Field()
	success: boolean;
}
