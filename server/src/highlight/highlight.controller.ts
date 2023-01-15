import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Highlight, User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { CreateHighlightDto, UpdateHighlightDto } from './dto/highlight.dto';
import { HighlightService } from './highlight.service';

@Controller('api/highlight')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) {}

  /*새로운 Highlight 생성*/
  @Post('/create')
  async createHighlight(
    @Body() createHighlightDto: CreateHighlightDto,
    @GetUser() user: User,
  ): Promise<Highlight> {
    createHighlightDto.user_email = user.email;
    createHighlightDto.group_id = user.group_id;

    // createHighlightDto.user_email = 'siaksiak@jungle.com';
    // createHighlightDto.group_id = 1;

    return this.highlightService.createHighlight(createHighlightDto, user);
  }

  // Id로 highlight 찾기
  @Get('/id/:id')
  async findHighlight(@Param('id') id: number): Promise<Highlight> {
    return this.highlightService.findHighlight(id);
  }

  // URL로 찾은 Feed에 있는 모든 highlight 찾기
  @Get('/feed/endpoint')
  async findHighlightAll(
    @GetUser() user: User,
    @Query('url') url: string,
  ): Promise<any> {
    return this.highlightService.findAllHighlightInFeed(user.group_id, url);
  }

  // Update(미완성)
  @Patch('/update/:id')
  async updateHighlight(
    @Param('id') id: number,
    @Body() updateHighlightDto: UpdateHighlightDto,
  ): Promise<Highlight> {
    return this.highlightService.updateHighlight(id, updateHighlightDto);
  }

  // Id로 Highlight 찾은 후 삭제
  @Delete('/delete')
  async deleteHighlight(@Body('id') id: number): Promise<boolean> {
    return this.highlightService.deleteHighlight(id);
  }
}
