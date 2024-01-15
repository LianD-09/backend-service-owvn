import { Gender } from '@prisma/client';
import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  fullName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Matches(/^\d{2}-\d{2}-\d{4}$/)
  dob?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(4, 32)
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  token?: string

  @Field(() => Gender, { nullable: true })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender
}

