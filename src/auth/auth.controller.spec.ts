import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { ConfigModule } from '@nestjs/config';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
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

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a user and return the result', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'testPassword',
      };
      const expectedResult = { token: 'testToken' };

      jest.spyOn(authService, 'signIn').mockResolvedValue(expectedResult);

      const result = await authController.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw HttpException if signIn fails', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'testPassword',
      };
      const errorMessage = 'Invalid credentials';

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new Error(errorMessage));

      try {
        await authController.signIn(signInDto);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
