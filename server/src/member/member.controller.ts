import { MemberService } from './member.service';
import {
  Controller,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '@prisma/client';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';

@Controller('api/member')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard())
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 유저아이디에 따른 그룹 생성
  @Post('create')
  async createGroup(@GetUser() user_info: User, @Body() body: Body) {
    return this.memberService.createGroup(user_info, body);
  }

  // 그룹 참가
  @Post('join')
  async joinGroup(@GetUser() user_info: User, @Body() body: Body) {
    return this.memberService.joinGroup(user_info, body);
  }
}
