import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAdminInput {
  @Field(() => String, {})
  userName: string;

  @Field(() => String, {})
  password: string;

  @Field(() => String, {})
  fullName: string;

  @Field(() => String, {})
  dob: string;

  @Field(() => String, {})
  phone: string;

  @Field(() => String, {})
  email: string;
}
