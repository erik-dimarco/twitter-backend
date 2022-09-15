import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import 'reflect-metadata';

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

	const app = express();
	const httpServer = createServer(app);

	const server = new ApolloServer({
		context,
		schema,
		formatError: graphQLErrorHandler,
		plugins: [
			// Proper shutdown for the HTTP server.
			ApolloServerPluginDrainHttpServer({ httpServer }),

			// Proper shutdown for the WebSocket server.
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
						}
					};
				}
			},
			ApolloServerPluginLandingPageLocalDefault({ embed: true })
		]
	});

	const wsServer = new WebSocketServer({
		server: httpServer,
		path: '/graphql'
	});

	const serverCleanup = useServer({ schema }, wsServer);

	const { port, path } = config.server;

	await server.start();
	server.applyMiddleware({ app, path });

	// The GraphQL endpoint
	httpServer.listen(port, () => {
		console.log(`🚀 Query endpoint ready at http://localhost:${port}${server.graphqlPath}`);
		console.log(`🚀 Subscription endpoint ready at ws://localhost:${port}${server.graphqlPath}`);
	});
};

main();
