import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { CustomerObject } from './dto/customer-object.dto';
import { CustomersService } from './customers.service';

@Resolver(() => CustomerObject)
export class CustomersResolver {
  constructor(private customersService: CustomersService) {}

  @Query(() => CustomerObject)
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return this.customersService.findById(id);
  }

  @Query(() => [CustomerObject])
  async getCustomers() {
    return this.customersService.getAll();
  }

  // Example of accessing relation:
  //   @ResolveField()
  //   async posts(@Parent() user: UserObject) {
  //     const { id } = user;
  //     return this.postsService.findAll({ userId: id });
  //   }
}
