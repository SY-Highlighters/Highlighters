import { Noti } from './../../node_modules/.prisma/client/index.d';
import { Controller, UseGuards, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { NotiService } from './noti.service';

@Controller('api/noti')
@UseGuards(AuthGuard())
export class NotiController {
  constructor(private readonly notiService: NotiService) {}

  // 노티 생성
  @Post('/create')
  async createNoti(
    @Body() createNotiDto: CreateNotiDto,
    @GetUser() user: User,
  ): Promise<Noti> {
    createNotiDto.user_email = user.email;
    createNotiDto.group_id = user.group_id;

    return this.notiService.createNoti(createNotiDto);
  }

  // 노티 삭제

  // 웹에서의 노티 조회(송신자 포함)

  // 익스텐션에서의 노티 조회(송신자 제외)

  // 노티 모두 읽음 처리

  // 노티 읽음 처리
}
