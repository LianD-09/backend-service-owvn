import { ObjectType, Field } from '@nestjs/graphql';
import { Gender, Status } from '@prisma/client';

@ObjectType('User', { isAbstract: true})
export class User {
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

  @Field(() => Gender, {})
  gender: Gender;

  @Field(() => Status, {})
  status: Status;
}
