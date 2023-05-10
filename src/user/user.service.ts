import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

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

  async editUser(user: EditUserDto, userId: number) {
    const userFound = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...user,
      },
    });

    delete userFound.hash;

    return user;
  }
}
