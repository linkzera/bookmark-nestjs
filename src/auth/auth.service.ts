import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (await argon2.verify(user.hash, dto.password)) {
        return this.signToken(user.id, user.email);
      } else {
        return { msg: 'wrong password' };
      }
    } catch (err) {
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  async signup(dto: AuthDto) {
    try {
      const hash = await argon2.hash(dto.password);
      //create user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      //return user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');

    const token = this.jwt.sign(payload, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
