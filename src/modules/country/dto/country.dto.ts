import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaginateResponse } from 'src/common/paginate/dto/paginate.dto';
import { TranslationDto } from 'src/i18n/i18n.dto';

@ObjectType()
export class CountryTranslationDto extends TranslationDto {
    @Field()
    name: string;

    @Field()
    nationality: string;
}

@ObjectType()
export class CountryDto {
    @Field(() => ID, { nullable: true })
    id: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    code: string;

    @Field({ nullable: true })
    primary?: boolean;

    @Field({ nullable: true })
    phoneCode: string;

    @Field({ nullable: true })
    flag: string;

    @Field({ nullable: true })
    nationality: string;

    @Field(() => [CountryTranslationDto], { defaultValue: [] })
    translate?: CountryTranslationDto[];
}

@ObjectType()
export class CountryPaginateDto {
    @Field(() => [CountryDto])
    data: CountryDto[];

    @Field()
    pagination?: PaginateResponse;
}
