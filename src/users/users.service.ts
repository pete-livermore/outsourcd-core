import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'kysely';
import { UnsanitizedUser, User } from './user.model';
import { UsersRepository } from './users.repository';
import { ValidationService } from 'src/validation/validation.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersParamsDto } from './dto/find-users-params.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PopulateUserDto } from './dto/populate-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    await this.validationService.validateDto(user, CreateUserDto);

    const hashedPassword = await bcrypt.hash(
      user.password,
      this.configService.get('PASSWORD_SALT_ROUNDS'),
    );

    return this.usersRepository.create({ ...user, password: hashedPassword });
  }

  async getAll(params?: FindUsersParamsDto) {
    await this.validationService.validateDto(params, FindUsersParamsDto);

    return this.usersRepository.getAll(params);
  }

  async findById(
    userId: number,
    populate?: PopulateUserDto,
  ): Promise<User | undefined> {
    const user = await this.usersRepository.findById(userId, populate);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByEmail(
    email: string,
    populate?: PopulateUserDto,
  ): Promise<UnsanitizedUser | undefined> {
    const user = await this.usersRepository.findByEmail(email, populate);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(userId: number, userUpdate: UpdateUserDto) {
    await this.validationService.validateDto(userUpdate, UpdateUserDto);

    const user = await this.usersRepository.update(userId, userUpdate);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  delete(userId: number): Promise<DeleteResult> {
    return this.usersRepository.delete(userId);
  }
}
