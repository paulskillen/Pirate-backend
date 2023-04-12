import {
    Field,
    GraphQLISODateTime,
    InputType,
    OmitType,
    PartialType,
    PickType,
} from '@nestjs/graphql';
import { PaginateRequest } from 'src/common/paginate/dto/paginate.dto';

@InputType()
export class LoginInput {
    @Field()
    username: string;

    @Field()
    password: string;
}
