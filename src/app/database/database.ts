import { Kysely } from 'kysely';
import {
  Files as FilesTable,
  Permissions as PermissionsTable,
  Roles as RolesTable,
  Users as UsersTable,
  Customers as CustomersTable,
  CustomersOrders as CustomersOrdersTable,
  Orders as OrdersTable,
  RolesPermissions as RolesPermissionsTable,
} from 'src/kysely-types';

export interface Tables {
  users: UsersTable;
  files: FilesTable;
  roles: RolesTable;
  permissions: PermissionsTable;
  roles_permissions: RolesPermissionsTable;
  customers: CustomersTable;
  orders: OrdersTable;
  customers_orders: CustomersOrdersTable;
}

export class Database extends Kysely<Tables> {}
