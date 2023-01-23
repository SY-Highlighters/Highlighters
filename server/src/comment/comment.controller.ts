import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto, ShowCommentDto } from './dto/comment.dto';
import { Comment } from '.prisma/client';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';

@Controller('/api/comment')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthGuard('jwt'))
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 새로운 Comment 생성
  @Post('/create/:feed_id')
  async createComment(
    @Body('feed_id') feed_id: number,
    @Body('content') content: string,
    @GetUser() user: User,
  ): Promise<Comment> {
    const createCommentDto = new CreateCommentDto();
    createCommentDto.contents = content;
    createCommentDto.feed_id = feed_id;
    createCommentDto.user_email = user.email;

    return this.commentService.createComment(createCommentDto);
  }

  // feed의 모든 Comment 가져오기
  @Get('/get/:feed_id')
  async getComments(
    @Param('feed_id') feed_id: number,
  ): Promise<ShowCommentDto[]> {
    return this.commentService.getComments(feed_id);
  }

  // Comment 삭제
  @Delete('/delete/:comment_id')
  async deleteComment(
    @Param('comment_id') comment_id: number,
  ): Promise<Comment> {
    return this.commentService.deleteComment(comment_id);
  }
}
