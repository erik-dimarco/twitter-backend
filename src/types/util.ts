import { ArgsType, Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export abstract class TimeStamps {
	@Field()
	createdAt?: Date;

	@Field()
	updatedAt?: Date;
}

@ArgsType()
export class PageInput {
	@Field(() => Int, { nullable: true })
	page?: number;

	@Field(() => Int, { nullable: true })
	skip?: number;
}
