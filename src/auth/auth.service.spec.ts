import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UnsanitizedUser } from 'src/users/user.model';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  compareSync: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            signAsync: jest.fn(),
            verify: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  const username = 'user@example.com';
  const password = 'password';
  const hashedPassword = 'hashedPassword';
  const userId = 1;
  const email = 'user@example.com';
  const token = 'accessToken';

  const user: UnsanitizedUser = {
    id: userId,
    email: email,
    password: hashedPassword,
    firstName: 'test',
    lastName: 'user',
    role: 2,
    createdAt: new Date('2024-06-14 13:36:58.171'),
    updatedAt: new Date('2024-06-14 13:36:58.171'),
  };

  describe('when the signIn method is called', () => {
    describe('and the credentials are valid', () => {
      beforeEach(() => {
        jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
        jest.mocked(bcrypt.compareSync).mockReturnValue(true);
        jest.spyOn(jwtService, 'sign').mockImplementation(() => token);
        jest.spyOn(configService, 'get').mockImplementation((key: string) => {
          if (key === 'JWT_SECRET') {
            return 'fake_secret';
          }
          return undefined;
        });
      });
      it('call usersService.findByEmail with the provided username', async () => {
        await authService.signIn(username, password);
        expect(usersService.findByEmail).toHaveBeenCalledWith(username);
      });

      it('should call jwtService.sign with the relevant data', async () => {
        await authService.signIn(username, password);
        expect(jwtService.sign).toHaveBeenCalledWith(
          {
            id: user.id,
            email: email,
            role: user.role,
          },
          { secret: 'fake_secret' },
        );
      });

      it('should return an access token', async () => {
        const result = await authService.signIn(username, password);
        expect(result).toEqual({ token, user: { id: user.id } });
      });
    });

    describe('and the credentials are invalid', () => {
      it("should throw an UnauthorizedException if the user can't be found", async () => {
        const username = 'user@example.com';
        const password = 'password';

        jest
          .spyOn(usersService, 'findByEmail')
          .mockRejectedValue(new NotFoundException());
        await expect(authService.signIn(username, password)).rejects.toThrow(
          UnauthorizedException,
        );
      });

      it("should throw an UnauthorizedException if the password doesn't match the stored password", async () => {
        const username = 'user@example.com';
        const password = 'password';

        jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
        jest.mocked(bcrypt.compareSync).mockReturnValue(false);
        await expect(authService.signIn(username, password)).rejects.toThrow(
          UnauthorizedException,
        );
      });
    });
  });
});
