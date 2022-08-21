import { buildSchema } from 'type-graphql';

import { GraphQLSchema } from 'graphql';
import { UsersResolver } from './users/resolver';
import { UserTweetsResolver } from './userTweets/resolver';

export const createSchema = (): Promise<GraphQLSchema> => buildSchema({ resolvers: [UsersResolver, UserTweetsResolver] });
