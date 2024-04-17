import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Customers {
  address: string | null;
  city: string | null;
  country: string | null;
  created_at: Generated<Timestamp>;
  email: string;
  first_name: string;
  id: Generated<number>;
  is_confirmed: Generated<boolean>;
  last_name: string;
  password: string;
  postcode: string | null;
  updated_at: Generated<Timestamp>;
}

export interface CustomersOrders {
  created_at: Generated<Timestamp>;
  customer_id: number | null;
  order_id: number | null;
  updated_at: Generated<Timestamp>;
}

export interface Files {
  created_at: Generated<Timestamp>;
  description: string | null;
  ext: string;
  id: Generated<number>;
  mime: string;
  name: string;
  provider: string;
  provider_metadata: Json;
  updated_at: Generated<Timestamp>;
  url: string;
}

export interface Orders {
  created_at: Generated<Timestamp>;
  customer_id: number | null;
  fulfillment_ref: string | null;
  id: Generated<number>;
  updated_at: Generated<Timestamp>;
}

export interface Permissions {
  action: string;
  created_at: Generated<Timestamp>;
  entity: string;
  id: Generated<number>;
  updated_at: Generated<Timestamp>;
}

export interface Roles {
  created_at: Generated<Timestamp>;
  description: string | null;
  id: Generated<number>;
  name: string;
  updated_at: Generated<Timestamp>;
}

export interface RolesPermissions {
  created_at: Generated<Timestamp>;
  permission_id: number;
  role_id: number;
  updated_at: Generated<Timestamp>;
}

export interface Users {
  created_at: Generated<Timestamp>;
  email: string;
  first_name: string;
  id: Generated<number>;
  last_name: string;
  password: string;
  role_id: number | null;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  customers: Customers;
  customers_orders: CustomersOrders;
  files: Files;
  orders: Orders;
  permissions: Permissions;
  roles: Roles;
  roles_permissions: RolesPermissions;
  users: Users;
}
