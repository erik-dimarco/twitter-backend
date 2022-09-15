import { Field, InputType, ObjectType } from 'type-graphql';

import { User } from 'gql/users/schema';

@ObjectType()
export class LoginResponse {
	@Field()
	token: string;
}

@ObjectType()
export class ValidateMagicLinkResponse {
	@Field()
	token: string;

	@Field({ nullable: true })
	newEmail?: string;
}

@ObjectType()
export class ResetPasswordResponse {
	@Field({ nullable: true })
	token: string;

	@Field({ nullable: true })
	signRequest?: string;

	@Field({ nullable: true })
	host?: string;
}

@ObjectType()
export class SendForgotPasswordEmailResponse {
	@Field()
	success: boolean;
}

// for mutations
@InputType()
export class LoginInput implements Partial<User> {
	@Field()
	email: string;

	@Field()
	password: string;
}

@InputType()
export class RegisterInput implements Partial<User> {
	@Field()
	firstName: string;

	@Field()
	lastName: string;

	@Field()
	email: string;

	@Field()
	password: string;
}

@ObjectType()
export class RegisterResponse {
	@Field()
	token: string;

	@Field(() => User)
	user: User;
}

// @InputType()
// export class RegisterAdminInput implements Partial<User> {
// 	@Field()
// 	firstName: string;

// 	@Field()
// 	lastName: string;

// 	@Field()
// 	email: string;

// 	@Field(() => String)
// 	role: UserRole;
// }

@InputType()
export class SendUpdateEmailAddressInput {
	@Field()
	oldEmail: string;

	@Field()
	newEmail: string;
}
