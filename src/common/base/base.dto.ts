import {
  Field,
  GraphQLISODateTime,
  ID,
  InputType,
  ObjectType,
} from '@nestjs/graphql';
import JSON from 'graphql-type-json';

@ObjectType()
export class BaseDto {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field(() => JSON, { nullable: true })
  updatedAt?: Date;

  @Field(() => JSON, { nullable: true })
  createdAt?: Date;
}
