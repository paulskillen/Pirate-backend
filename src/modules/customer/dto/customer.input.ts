import {
    Field,
    GraphQLISODateTime,
    InputType,
    OmitType,
    PartialType,
    PickType,
} from '@nestjs/graphql';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';
import { CustomerTitle, Gender } from '../customer.constant';

@InputType()
export class CustomerRegisterInput {
    @Field({ nullable: true })
    avatar?: string;

    // personal information

    @Field(() => CustomerTitle)
    title: CustomerTitle;

    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field({ nullable: true })
    phoneCode?: string;

    @Field({ nullable: true })
    socialId?: string;

    @Field({ nullable: true })
    phone?: string;

    // privacy information
    @Field(() => String, { nullable: true })
    nationality?: string;
}

@InputType()
export class CustomerCreateInput extends CustomerRegisterInput {}

@InputType()
export class CustomerPaginateRequest extends PaginateRequest {
    @Field(() => [String], { nullable: true })
    branches?: string[];
}
