import { Controller, UseGuards, Post, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { NotiService } from './noti.service';
import { CreateNotiDto, DeleteNotiDto, ShowNotiDto } from './dto/noti.dto';
import { Delete, UseFilters, UseInterceptors } from '@nestjs/common/decorators';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';

@Controller('api/noti')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard())
export class NotiController {
  constructor(private readonly notiService: NotiService) {}

  // 노티 생성
  @Post('/create')
  async createNoti(
    @Body() createNotiDto: CreateNotiDto,
    @GetUser() user: User,
  ): Promise<number> {
    createNotiDto.user_email = user.email;
    createNotiDto.group_id = user.group_id;
    createNotiDto.nickname = user.nickname;

    return this.notiService.createNoti(createNotiDto);
  }

  // 노티 삭제
  @Delete('/delete')
  async deleteNoti(
    @Body() deleteNotiDto: DeleteNotiDto[],
    @GetUser() user: User,
  ): Promise<null> {
    return this.notiService.deleteNoti(deleteNotiDto, user);
  }

  // 웹에서의 노티 조회(송신자 포함)
  @Get('/web')
  async findNotiWeb(@GetUser() user: User): Promise<ShowNotiDto[]> {
    return this.notiService.findNotiWeb(user);
  }

  // 익스텐션에서의 노티 조회(송신자 제외)
  @Get('/extension')
  async findNotiExtension(@GetUser() user: User): Promise<ShowNotiDto[]> {
    return this.notiService.findNotiExtension(user);
  }
}