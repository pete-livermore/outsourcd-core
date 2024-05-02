import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { UserObject } from './dto/user-object.dto';
import { UsersService } from './users.service';

@Resolver(() => UserObject)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => UserObject)
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findById(id);
  }

  @Query(() => [UserObject])
  async getUsers() {
    return this.usersService.getAll();
  }

  // Example of accessing relation:
  //   @ResolveField()
  //   async posts(@Parent() user: UserObject) {
  //     const { id } = user;
  //     return this.postsService.findAll({ userId: id });
  //   }
}
