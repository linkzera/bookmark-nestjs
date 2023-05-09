import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    delete user.hash;

    return user;
  }

  async editUser(firstName: string, lastName: string, userId: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
      },
    });

    delete user.hash;

    return user;
  }
}
