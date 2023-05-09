import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser('id') userId: number) {
    return this.userService.getMe(userId);
  }

  @Patch('me')
  editUser(
    @GetUser('id') userId: number,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
  ) {
    return this.userService.editUser(firstName, lastName, userId);
  }
}
