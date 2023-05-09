import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { AuthDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async login(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (await argon2.verify(user.hash, dto.password)) {
        delete user.hash;
        return user;
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
}
