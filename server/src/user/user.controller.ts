import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserService } from './user.service';

@Controller('api/user')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/signin')
  async findSignInUserGroupInfo(@GetUser() user: User): Promise<object> {
    return this.userService.findSignInUserGroupInfo(user.email);
  }
}
