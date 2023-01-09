import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/comment.dto';
import { Comment } from '.prisma/client';

@Controller('comment')
@UseGuards(AuthGuard())
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 새로운 Comment 생성
  @Post('/create:feed_id')
  async createComment(
    @Param('feed_id') feed_id: number,
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ): Promise<Comment> {
    createCommentDto.feed_id = feed_id;
    createCommentDto.user_email = user.email;

    return this.commentService.createComment(createCommentDto);
  }

  // feed의 모든 Comment 가져오기
  @Post('/get:feed_id')
  async getComments(@Param('feed_id') feed_id: number): Promise<Comment[]> {
    return this.commentService.getComments(feed_id);
  }

  // Comment 삭제
  @Post('/delete:id')
  async deleteComment(@Param('id') id: number): Promise<Comment> {
    return this.commentService.deleteComment(id);
  }

}
