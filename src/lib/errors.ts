import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-express';

/***
 * This file holds all errors that we will use. Apollo has 3 types of errors Authentication,
 * UserInput and then custom apollo errors. If the error you are throwing doesn't fall into UserInput
 * or Authentication, then define a new Apollo error, and pass the name of the error as the second
 * parameter. e.g. an error for an email that has already beem
 */

export const InvalidRoleError = new AuthenticationError('Not authorized for this role');

export const InvalidTokenError = new AuthenticationError('Invalid token used');

export const InvalidHeaderError = new AuthenticationError('Authorization header not found');

export const InvalidOrganizationRegistrationError = (properties: Record<string, string>): UserInputError =>
	new UserInputError('Failed to register organization. Invalid form data', properties);

export const InvalidOrganizationUpdateError = (properties: Record<string, string>): UserInputError =>
	new UserInputError('Failed to update organization. Invalid form data', properties);

export const InvalidRegistrationFormData = (properties: Record<string, string>): UserInputError =>
	new UserInputError('Failed to register user. Invalid form data', properties);

export const LoginError = new UserInputError('Invalid credentials used, email/password are incorrect');

export const ReuseOldPassword = new ApolloError('You have used this password before, please try another one', 'BAD_PASSWORD');

export const LoginConfirmRegistrationError = new ApolloError('Please check your email inbox to confirm your registration.', 'LOGIN_NOT_CONFIRMED');

export const RequireResetPasswordError = new ApolloError('Please reset your password.', 'REQUIRE_RESET_PASSWORD');
