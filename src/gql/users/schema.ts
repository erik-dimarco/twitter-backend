import { TimeStamps } from 'types/util';
import { ArgsType, Field, ID, InputType, ObjectType } from 'type-graphql';
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

	@Field(() => String, { nullable: true })
	profileImage: string | null;

	@Field(() => String, { nullable: true })
	username: string | null;
}

@ObjectType()
export class OperationSuccess {
	@Field()
	success: boolean;
}

@ObjectType()
export class SaveProfileImageResponse implements Partial<User> {
	@Field()
	profileImage: string;
}

@InputType()
export class SaveProfileImageInput implements Partial<User> {
	@Field()
	profileImage: string;
}

@InputType()
export class SaveUsernameInput implements Partial<User> {
	@Field()
	username: string;
}

@ArgsType()
export class SearchInput {
	@Field({ nullable: true })
	searchTerm?: string;

	@Field(() => ID, { nullable: true })
	cursor?: string;
}

@ObjectType()
export class Pagination {
	@Field()
	hasMoreResults: boolean;

	@Field(() => ID, { nullable: true })
	cursor?: string;
}

@ObjectType()
export class UsersResponse {
	@Field(() => [User])
	users: User[];

	@Field(() => Pagination)
	pagination: Pagination;
}
