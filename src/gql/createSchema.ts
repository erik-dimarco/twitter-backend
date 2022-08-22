import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';

import resolvers from './resolvers';

export const createSchema = (): Promise<GraphQLSchema> => buildSchema({ resolvers });
