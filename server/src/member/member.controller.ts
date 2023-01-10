import { MemberService } from './member.service';
import {
  Controller,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { Body, Get, Post } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from '@prisma/client';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { CreateGroupDto } from './dto/group.dto';

@Controller('api/group')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 유저아이디에 따른 그룹 생성
  @Post('/create')
  async createGroup(
    @GetUser() user: User,
    @Body() createGroupDto: CreateGroupDto,
  ): Promise<number> {
    createGroupDto.user_email = user.email;

    return this.memberService.createGroup(createGroupDto);
  }

  // 그룹 참가
  @Post('/join')
  async joinGroup(
    @GetUser() user: User,
    @Body('group_code') group_code: string,
  ): Promise<number> {
    return this.memberService.joinGroup(user.email, group_code);
  }

  @Get('/code')
  async getGroupCode(@GetUser() user: User): Promise<string> {
    return this.memberService.getGroupCode(user.group_id);
  }
}
