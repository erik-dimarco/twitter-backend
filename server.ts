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
	// expressAsyncErrors;
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
		// playground: {
		// 	settings: {
		// 		'editor.theme': 'dark',
		// 		'editor.cursorShape': 'line'
		// 	}
		// },
		formatError: graphQLErrorHandler
	});

	const app = express();

	const { port, path } = config.server;

	// app.set('etag', false);
	// app.use(express.json());
	// app.use(express.urlencoded({ extended: false }));

	await server.start();
	server.applyMiddleware({ app, path });

	// The GraphQL endpoint
	app.listen(port, () => {
		log.info(`🚀 The server has started on port ${port}`);
	});
};

main();
