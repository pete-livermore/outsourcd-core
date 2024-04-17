import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserObject {
  @Field(() => Int)
  id: number;

  @Field({ description: `First name of user`, nullable: true })
  firstName?: string;

  @Field({ description: `Surname of user`, nullable: true })
  lastName?: string;

  @Field({ description: `User's email address`, nullable: true })
  email?: string;
}
