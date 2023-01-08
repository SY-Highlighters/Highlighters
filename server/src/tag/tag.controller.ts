import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { CreateTagDto } from './dto/tag.dto';
import { TagService } from './tag.service';

@Controller('/api/tag')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard())
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // 태그 생성
  @Post('/create')
  async createTag(
    @Body() createTagDto: CreateTagDto,
    @GetUser() user: User,
  ): Promise<null> {
    createTagDto.group_id = user.group_id;

    return this.tagService.createTag(createTagDto);
  }

  // 태그 삭제

  // 태그 조회(웹)
}
