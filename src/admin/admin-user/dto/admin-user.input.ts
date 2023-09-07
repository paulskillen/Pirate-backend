import {
    Field,
    GraphQLISODateTime,
    InputType,
    PartialType,
} from '@nestjs/graphql';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';
import { OrderStatus } from 'src/modules/order/order.constant';
import { JobTypeAdmin, SpecialAccessType } from '../admin-user.constant';

@InputType()
export class UpdateSpecialAccessAdminUserInput {
    @Field(() => Boolean, { nullable: true })
    status: boolean;

    @Field(() => String, { nullable: true })
    code: string;

    @Field(() => GraphQLISODateTime, { nullable: true })
    expired: Date;

    @Field(() => SpecialAccessType, { nullable: true })
    specialAccessType: SpecialAccessType;
}

@InputType()
export class CreateAdminUserInput {
    @Field(() => String, { nullable: false })
    username: string;

    @Field(() => String, { nullable: true })
    firstName: string;

    @Field(() => String, { nullable: true })
    lastName: string;

    @Field(() => String, { nullable: true })
    nickName: string;

    @Field(() => String, { nullable: true })
    email: string;

    @Field(() => String, { nullable: true })
    avatar: string;

    @Field(() => String, { nullable: true })
    companyId: string;

    @Field(() => String, { nullable: true })
    role: string;

    @Field(() => String, { nullable: true })
    password: string;

    @Field(() => Boolean, { nullable: true })
    status: boolean;

    @Field(() => Boolean, { nullable: true })
    authenticationStatus: boolean;

    @Field(() => String, { nullable: true })
    authenticationCode: string;

    @Field(() => [OrderStatus], { nullable: true })
    orderStatusManagement: OrderStatus[];
}

@InputType()
export class UpdateAdminUserInput extends PartialType(CreateAdminUserInput) {
    @Field(() => String, { nullable: true })
    username: string;
}

@InputType()
export class ListAdminUserInput extends PaginateRequest {}

@InputType()
export class SearchAdminUserInput extends PaginateRequest {}
