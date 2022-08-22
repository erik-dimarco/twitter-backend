import { UsersResolver } from './users/resolver';
import { UserTweetsResolver } from './userTweets/resolver';
import { UsersAuthResolver } from './auth/resolver';

// Add all resolvers to this array
const resolversArr = [UsersResolver, UserTweetsResolver, UsersAuthResolver] as const;

// Resolvers to provide to the GraphQLServer schema
export default resolversArr;
