import { UsersResolver } from './users/resolver';
import { TweetsResolver } from './tweets/resolver';
import { UsersAuthResolver } from './auth/resolver';
import { FollowsResolver } from './follows/resolver';
import { NewTweetsSubscriptionResolver } from './newTweetsSubscription/resolver';
import { LikesResolver } from './likes/resolver';

// Add all resolvers to this array
const resolversArr = [LikesResolver, UsersResolver, TweetsResolver, UsersAuthResolver, FollowsResolver, NewTweetsSubscriptionResolver] as const;

// Resolvers to provide to the GraphQLServer schema
export default resolversArr;
