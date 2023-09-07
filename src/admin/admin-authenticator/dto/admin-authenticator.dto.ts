import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GenerateSecretResponse {
  @Field(() => String, { nullable: true })
  secret: string;
}
