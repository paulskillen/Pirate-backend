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
export class FamilyInformationRequest {
  @Field()
  name: string;

  @Field({ nullable: true })
  relationship?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field()
  phone: string;
}

@InputType()
export class EmergencyContactRequest {
  @Field()
  name: string;

  @Field({ nullable: true })
  relationship?: string;

  @Field({ nullable: true })
  residence?: string;

  @Field()
  phone: string;
}

@InputType()
export class SurgeryHistoryRequest {
  @Field()
  date?: Date;

  @Field()
  surgery?: string;

  @Field()
  hospital?: string;
}

@InputType()
export class SurveyAnswersRequest {
  @Field()
  questionId: string;

  @Field(() => [String])
  answers?: string[];
}

@InputType()
export class CustomerCreateRequest {
  @Field({ nullable: true })
  avatar?: string;

  // privacy information

  @Field()
  branchId: string;

  // personal information

  @Field(() => CustomerTitle)
  title: CustomerTitle;

  @Field()
  firstNameTh: string;

  @Field()
  lastNameTh: string;

  @Field()
  firstNameEn: string;

  @Field()
  lastNameEn: string;

  @Field()
  nickname: string;

  @Field(() => Gender)
  gender: Gender;

  @Field(() => GraphQLISODateTime)
  birthDay: Date;

  // privacy information

  @Field({ nullable: true })
  citizenId!: string;

  @Field(() => String)
  nationality!: string;

  @Field({ nullable: true })
  passportNo?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  passportExp?: Date;

  @Field({ nullable: true })
  religion?: string;

  @Field({ nullable: true })
  maritalStatus!: string;

  @Field({ nullable: true })
  numberOfChild?: number;

  // contact information

  @Field()
  phone: string;

  @Field({ nullable: true })
  alternativePhone: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  lineId?: string;

  @Field({ nullable: true })
  instagram?: string;

  @Field({ nullable: true })
  facebook?: string;

  @Field(() => [FamilyInformationRequest], { nullable: true })
  familyInformation?: FamilyInformationRequest[];

  @Field(() => [EmergencyContactRequest], { nullable: true })
  emergencyContact?: EmergencyContactRequest[];
}

@InputType()
export class CustomerUpdateFamilyEmergencyRequest extends PartialType(
  PickType(CustomerCreateRequest, ['familyInformation', 'emergencyContact']),
) {}

@InputType()
export class CustomerUpdatePersonalInformationRequest extends PartialType(
  PickType(CustomerCreateRequest, [
    'title',
    'avatar',
    'firstNameEn',
    'lastNameEn',
    'firstNameTh',
    'lastNameTh',
    'nickname',
    'gender',
    'birthDay',
  ]),
) {}

@InputType()
export class CustomerUpdatePrivacyInformationRequest extends PartialType(
  PickType(CustomerCreateRequest, [
    'citizenId',
    'passportNo',
    'passportExp',
    'nationality',
    'religion',
    'maritalStatus',
    'numberOfChild',
  ]),
) {}

@InputType()
export class CustomerUpdateContactInformationRequest extends PartialType(
  PickType(CustomerCreateRequest, [
    'phone',
    'alternativePhone',
    'email',
    'lineId',
    'facebook',
    'instagram',
  ]),
) {}

@InputType()
export class CustomerUpdateMedicalProfileRequest {
  @Field({ nullable: true })
  height?: number;

  @Field({ nullable: true })
  weight?: number;

  @Field({ nullable: true })
  bloodGroup?: string;

  @Field({ nullable: true })
  bloodPressure?: string;

  @Field({ nullable: true })
  allergyHis?: string;

  @Field({ nullable: true })
  underDisease?: string;

  @Field(() => [SurgeryHistoryRequest], { nullable: true })
  surgeryHis?: SurgeryHistoryRequest[];
}

@InputType()
export class CustomerPaginateRequest extends PaginateRequest {
  @Field(() => [String], { nullable: true })
  branches?: string[];
}
