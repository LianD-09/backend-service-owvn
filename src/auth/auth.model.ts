import { ObjectType, Field } from '@nestjs/graphql';
import { Role } from '../common/enums/common.enums';

@ObjectType('AdminLoginRes', { isAbstract: true })
export class Auth {
  @Field(() => String)
  token: string;

  // relation fields
  @Field(() => Role, { nullable: true })
  role: Role;
}
