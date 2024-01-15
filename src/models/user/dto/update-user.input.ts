import { Gender } from '@prisma/client';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
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

  @Field(() => Gender, { nullable: true })
  gender?: Gender
}

