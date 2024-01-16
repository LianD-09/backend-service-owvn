import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AuthDto {
  @Field(() => String)
  userName: string

  @Field(() => String)
  password: string
}
