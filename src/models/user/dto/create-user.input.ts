import { InputType, Field } from '@nestjs/graphql';
import { Gender, Status } from '@prisma/client';

@InputType()
export class CreateUserInput {
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

  @Field(() => Gender, {})
  gender: Gender;

  @Field(() => Status, {})
  status?: Status;
}
