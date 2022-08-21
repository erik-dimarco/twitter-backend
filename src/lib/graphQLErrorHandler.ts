import logger from './logger';
import * as _ from 'lodash';
import { ApolloError, AuthenticationError, UserInputError } from 'apollo-server-express';
import { GraphQLError } from 'graphql';

export default (error: GraphQLError): ApolloError => {
	const exception = _.get(error, 'extensions.exception');

	//For handling the boom errors that we sometimes throw deeper in the applications
	if (exception && exception.isBoom) {
		switch (exception.output.statusCode) {
			case 400:
				return new UserInputError(exception.output.payload.message);
			case 401:
				return new AuthenticationError(exception.output.payload.message);
			default:
				return new ApolloError(exception.output.payload.message, exception.output.payload.error.toUpperCase());
		}
	}
	logger.error('Apollo Error', error);

	return new ApolloError(error.message, error.extensions.code);
};
