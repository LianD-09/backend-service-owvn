import { InputType, Field } from '@nestjs/graphql';
import { Gender } from '@prisma/client';
import { IsEmail, IsEnum, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, {})
  @IsString()
  @Length(6, 32)
  userName: string;

  @Field(() => String, {})
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => String, {})
  @IsString()
  @MaxLength(32)
  fullName: string;

  @Field(() => String, {})
  @Matches(/^\d{2}-\d{2}-\d{4}$/)
  dob: string;

  @Field(() => String, {})
  @Length(4, 32)
  phone: string;

  @Field(() => String, {})
  @IsString()
  @IsEmail()
  email: string;

  @Field(() => Gender, {})
  @IsEnum(Gender)
  gender: Gender;
}
