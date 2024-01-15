import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('Admin', { isAbstract: true })
export class Admin {
  @Field(() => Number, {})
  id: number;

  @Field(() => String, {})
  userName: string;

  @Field(() => String, {})
  fullName: string;

  @Field(() => String, {})
  dob: string;

  @Field(() => String, { nullable: true })
  phone?: string;

  @Field(() => String, {})
  email: string;
}
