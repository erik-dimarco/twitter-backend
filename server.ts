import { ApolloServer } from 'apollo-server-express';
// import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
// import expressAsyncErrors from 'express-async-errors';

import config from 'config';
import { createSchema } from 'gql/createSchema';
import context from 'gql/context';
import graphQLErrorHandler from 'lib/graphQLErrorHandler';
import log from 'lib/logger';

const main = async () => {
	let schema;
	try {
		schema = await createSchema();
	} catch (err) {
		log.error(err);
		throw err;
	}

	const server = new ApolloServer({
		context,
		schema,
		formatError: graphQLErrorHandler
	});

	const app = express();

	const { port, path } = config.server;

	await server.start();
	server.applyMiddleware({ app, path });

	// The GraphQL endpoint
	app.listen(port, () => {
		log.info(`🚀 The server has started on port ${port}`);
	});
};

main();
