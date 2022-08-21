import { UsersResolver } from './users/resolver';
import { UserTweetsResolver } from './userTweets/resolver';

// Add all resolvers to this array
const resolversArr = [UsersResolver, UserTweetsResolver];

// Resolvers to provide to the GraphQLServer schema
export default resolversArr;
