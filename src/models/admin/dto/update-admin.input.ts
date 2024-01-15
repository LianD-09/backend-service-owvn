import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateAdminInput {
  @Field(() => String, { nullable: true })
  fullName?: string;

  @Field(() => String, { nullable: true })
  dob?: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  token?: string
}
