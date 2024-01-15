import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('Admin', { isAbstract: true })
export class Admin {
  @Field(() => Number, {})
  id: number;

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
