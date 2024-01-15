import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

@InputType()
export class CreateAdminInput {
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
  @IsOptional()
  @Length(4, 32)
  phone: string;

  @Field(() => String, {})
  @IsString()
  @IsEmail()
  email: string;
}
