import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { UnsanitizedUser } from 'src/app/users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<{ token: string }> {
    let user: UnsanitizedUser;

    try {
      user = await this.usersService.findByEmail(email);
    } catch (err) {
      throw new UnauthorizedException();
    }

    const isValidPassword = bcrypt.compareSync(pass, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    return { token };
  }
}
