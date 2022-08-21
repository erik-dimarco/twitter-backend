import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export abstract class TimeStamps {
	@Field()
	createdAt?: Date;

	@Field()
	updatedAt?: Date;
}
