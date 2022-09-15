import * as bcrypt from 'bcryptjs';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';

import config from 'config';
import { IContext } from 'gql/context';
import { User } from 'gql/users/schema';
import { decrypt } from 'lib/crypto';
import { InvalidRegistrationFormData, InvalidTokenError, LoginError, ReuseOldPassword } from 'lib/errors';
import { decode, encode } from 'lib/tokens';
import { LoginInput, LoginResponse, RegisterInput, RegisterResponse, ResetPasswordResponse } from './schema';

export function createSessionToken(user: User): string {
	return encode(user, user.role === 'user' ? config.jwt.userExpiresIn : config.jwt.adminExpiresIn);
}

@Resolver()
export class UsersAuthResolver {
	@Query(() => Int)
	async tokenExpirationTime(@Arg('token') token: string): Promise<number> {
		const payload = decode(token);
		return parseInt(payload.exp);
	}

	@Mutation(() => LoginResponse)
	async login(@Arg('input') { email, password }: LoginInput, @Ctx() ctx: IContext): Promise<LoginResponse> {
		email = email.toLowerCase();

		const user = await this._processLogin(email, password, ctx);

		const sessionToken = createSessionToken(user);

		return {
			token: sessionToken
		};
	}

	@Mutation(() => RegisterResponse)
	async register(
		@Arg('input')
		{ firstName, lastName, email, password }: RegisterInput,
		@Ctx() { db }: IContext
	): Promise<RegisterResponse> {
		const validationErrors: Record<string, string> = {};

		email = email.toLowerCase();

		const foundEmail = await db.users.findUnique({ where: { email } });
		if (foundEmail) {
			validationErrors.email = `A user with the email ${email} is already registered`;
		}
		if (Object.keys(validationErrors).length > 0) {
			throw InvalidRegistrationFormData(validationErrors);
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		const user: Pick<User, 'firstName' | 'lastName' | 'email' | 'hashedPassword' | 'role' | 'lastLogin'> = {
			firstName,
			lastName,
			email,
			hashedPassword,
			role: 'user',
			lastLogin: new Date()
		};
		const insertedUser = await db.users.create({ data: user });
		const sessionToken = createSessionToken(insertedUser);

		return {
			token: sessionToken,
			user: insertedUser
		};
	}

	// @Mutation(() => LoginResponse)
	// async confirmRegistration(@Arg('token') token: string, @Ctx() { db }: IContext): Promise<LoginResponse> {
	// 	const decoded: any = decode(token);

	// 	if (decoded.action !== 'confirmRegistration') throw InvalidTokenError;

	// 	const actingUser = decoded as User;
	// 	const userRecord = await userRepo.updateOne({ id: decoded.userId }, { confirmedRegistration: true }, actingUser);
	// 	const sessionToken = createSessionToken(userRecord);

	// 	const workerUtils = await getWorkerUtils();

	// 	logger.info('Ready to notify user to consent after 48 hours');
	// 	await workerUtils.addJob(
	// 		Jobs.userScreenerCadence,
	// 		{
	// 			userId: decoded.userId,
	// 			emailCounter: 1
	// 		},
	// 		{
	// 			runAt: addDays(new Date(), 2)
	// 		}
	// 	);

	// 	return {
	// 		token: sessionToken
	// 	};
	// }

	// @Mutation(() => ValidateMagicLinkResponse)
	// async updateEmailAddress(@Arg('token') token: string, @Ctx() { userRepo }: IContext): Promise<ValidateMagicLinkResponse> {
	// 	const decoded: any = decode(token);

	// 	if (decoded.action === 'updateEmail') {
	// 		const newEmail = decoded.newEmail;

	// 		const user = await userRepo.updateOne({ id: decoded.userId }, { lastLogin: new Date() }, { id: decoded.userId });
	// 		const sessionToken = createSessionToken(user);

	// 		const duplication = await userRepo.findOne({ email: newEmail });

	// 		if (duplication) {
	// 			return {
	// 				token: sessionToken
	// 			};
	// 		}

	// 		let previousEmails: string[];

	// 		if (user.previousEmails) {
	// 			previousEmails = user.previousEmails;
	// 			const exists = previousEmails.find(v => v === user.email);

	// 			if (!exists) {
	// 				previousEmails.push(user.email);
	// 			}
	// 		} else {
	// 			previousEmails = [user.email];
	// 		}

	// 		await userRepo.updateOne(
	// 			{ id: decoded.userId },
	// 			{
	// 				email: newEmail,
	// 				previousEmails: JSON.stringify(previousEmails)
	// 			}
	// 		);

	// 		return {
	// 			token: sessionToken,
	// 			newEmail: newEmail
	// 		};
	// 	}

	// 	throw InvalidTokenError;
	// }

	// @Mutation(() => User)
	// @UseMiddleware(authentication, authorization(['admin', 'clinician']))
	// async createAdminUser(
	// 	@Arg('input') { firstName, lastName, nickname, email, role, organizationId, ianaTimeZoneName }: RegisterNonParticipantInput,
	// 	@Ctx() ctx: IContext
	// ): Promise<User> {
	// 	const { userRepo, userNotificationPreferencesRepo } = ctx;
	// 	const { identity: actor } = ctx;
	// 	const validationErrors: Record<string, string> = {};
	// 	email = email.toLowerCase();

	// 	if (await userRepo.findOne({ email })) {
	// 		validationErrors.email = `A user with the email ${email} is already registered`;
	// 	}
	// 	if (!(await ctx.organizationsRepo.findOne({ id: organizationId }))) {
	// 		validationErrors.organization = `An organization with the id ${organizationId} does not exist`;
	// 	}

	// 	if (role === 'participant') validationErrors.role = `Invalid role`;
	// 	if (actor.role === 'clinician' && role === 'admin') throw new Error('You are not authorized to create a participant with this role.');

	// 	if (Object.keys(validationErrors).length > 0) {
	// 		throw InvalidRegistrationFormData(validationErrors);
	// 	}

	// 	const password = random.string({ length: 12 });

	// 	const hashedPassword = await bcrypt.hash(password, 12);
	// 	const user: Partial<User> = {
	// 		firstName,
	// 		lastName,
	// 		nickname,
	// 		email,
	// 		hashedPassword,
	// 		confirmedRegistration: true,
	// 		role,
	// 		organizationId,
	// 		ignoreData: true,
	// 		waitListed: false,
	// 		ianaTimeZoneName
	// 	};

	// 	const result = await userRepo.insertOne(user, actor);
	// 	await userNotificationPreferencesRepo.insertOne({ userId: result.id }, actor);

	// 	const workerUtils = await getWorkerUtils();
	// 	await workerUtils.addJob(Jobs.sendEmail, {
	// 		emailSender: 'sendUserCreatedEmail',
	// 		user: result,
	// 		emailData: { toEmail: result.email, user: result, password, actingUser: actor }
	// 	} as EmailPayload);

	// 	await workerUtils.addJob(
	// 		Jobs.annualPasswordExpirationNotification,
	// 		{
	// 			userId: result.id
	// 		},
	// 		{ runAt: addYears(new Date(), 1) }
	// 	);

	// 	return result;
	// }

	// @Mutation(() => SendForgotPasswordEmailResponse)
	// async sendForgotPasswordEmail(@Arg('email') email: string, @Ctx() { db }: IContext): Promise<SendForgotPasswordEmailResponse> {
	// 	const response = { success: true };
	// 	logger.info(`Received a forgot password request from: ${email}`);
	// 	// Check if email exists. We return a success regardless as a security best practice
	// 	const user = await db.users.findUnique({ where: { email } });
	// 	if (!user) return response;

	// 	const token = encode(
	// 		{
	// 			userId: user.id,
	// 			action: 'resetPassword'
	// 		},
	// 		3600 // 1 hour
	// 	);

	// 	const isParticipant = user.role === 'participant';
	// 	// const workerUtils = await getWorkerUtils();

	// 	// await workerUtils.addJob(Jobs.sendEmail, {
	// 	// 	emailSender: 'sendForgotPasswordEmail',
	// 	// 	user,
	// 	// 	emailData: {
	// 	// 		toEmail: user.email,
	// 	// 		firstName: user.firstName,
	// 	// 		link: encodeURI(`${isParticipant ? config.frontEndHost : config.adminHost}/reset?token=${token}`)
	// 	// 	}
	// 	// } as EmailPayload);

	// 	return response;
	// }

	@Mutation(() => ResetPasswordResponse)
	async resetPassword(@Arg('token') token: string, @Arg('newPassword') newPassword: string, @Ctx() { db }: IContext): Promise<ResetPasswordResponse> {
		const decoded: any = decode(token);

		if (decoded.action !== 'resetPassword') throw InvalidTokenError;

		const userRecord = await db.users.findUnique({ where: { id: decoded.userId } });

		const isReuse = await bcrypt.compare(newPassword, userRecord?.hashedPassword as string);
		if (isReuse) throw ReuseOldPassword;

		const hashedPassword = await bcrypt.hash(newPassword, 12);
		const updatedUserRecord = await db.users.update({
			where: {
				id: userRecord?.id
			},
			data: { hashedPassword }
		});

		// if (userRecord.confirmedRegistration !== true) {
		// 	// Re-send the confirmation email
		// 	await this._queueRegistrationReminder(userRecord);

		// 	return {
		// 		token: null
		// 	};
		// }

		const sessionToken = createSessionToken(updatedUserRecord);
		return {
			token: sessionToken
		};
	}

	// @Mutation(() => OperationSuccess)
	// async sendUpdateEmailAddressEmail(
	// 	@Arg('input') { oldEmail, newEmail }: SendUpdateEmailAddressInput,
	// 	@Ctx() ctx: IContext
	// ): Promise<OperationSuccess> {
	// 	const { userRepo } = ctx;

	// 	const user = await userRepo.findOne({ email: oldEmail });
	// 	if (!user) return { success: false };

	// 	const token = encode(
	// 		{
	// 			userId: user.id,
	// 			action: 'updateEmail',
	// 			newEmail: newEmail
	// 		},
	// 		86400 // 24 hours
	// 	);

	// 	const workerUtils = await getWorkerUtils();

	// 	await workerUtils.addJob(Jobs.sendEmail, {
	// 		emailSender: 'sendChangeEmailAddressEmail',
	// 		user,
	// 		emailData: {
	// 			toEmail: newEmail,
	// 			link: encodeURI(`${config.frontEndHost}/update_email?token=${token}&to=profile`)
	// 		}
	// 	} as EmailPayload);

	// 	return { success: true };
	// }

	private async _processLogin(email: string, password: string, { db }: IContext): Promise<User> {
		// const validationErrors: Record<string, string> = {};
		const userRecord = await db.users.findUnique({ where: { email } });

		// Check if the credentials are valid
		if (!userRecord) throw LoginError;

		// Checking if the user confirmed registration and sending them another email if they didn't
		// if (!userRecord.confirmedRegistration) {
		// 	validationErrors.error = 'Please check your email inbox to confirm your registration.';

		// 	await this._queueRegistrationReminder(userRecord);

		// 	// Throw error that the email needs to confirm registrations
		// 	throw LoginConfirmRegistrationError;
		// }

		// Compare hash to user record password
		const success = await bcrypt.compare(password, userRecord.hashedPassword);

		// Add validation error if password doesn't match
		if (!success) throw LoginError;

		// Check if the user was asked to reset password
		// if (userRecord.requireResetPassword) {
		// 	validationErrors.error = 'Please reset your password.';
		// 	throw RequireResetPasswordError;
		// }

		// Set the last login time to now
		return await db.users.update({
			where: {
				id: userRecord.id
			},
			data: { lastLogin: new Date() }
		});
	}
}
