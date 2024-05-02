import { ApiProperty } from '@nestjs/swagger';

export interface CustomerModelData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  is_confirmed: boolean;
  created_at: Date;
  updated_at: Date;
}

export class Customer {
  id: number;
  firstName: string;
  lastName: string;

  @ApiProperty()
  email: string;

  address: string;
  city: string;
  postcode: string;
  country: string;
  isConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  constructor(data: CustomerModelData) {
    this.id = data.id;
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.email = data.email;
    this.isConfirmed = data.is_confirmed;
    this.address = data.address;
    this.city = data.city;
    this.postcode = data.postcode;
    this.country = data.country;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }
}

interface UnsanitizedCustomerModelData extends CustomerModelData {
  password: string;
}

export class UnsanitizedCustomer extends Customer {
  password: string;

  constructor(data: UnsanitizedCustomerModelData) {
    super(data);
    this.password = data.password;
  }
}
