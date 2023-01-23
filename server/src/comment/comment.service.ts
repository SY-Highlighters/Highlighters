import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateCommentDto, ShowCommentDto } from './dto/comment.dto';
import { Comment } from '.prisma/client';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const { user_email, contents, feed_id } = createCommentDto;

    const result = await this.prismaService.comment.create({
      data: {
        contents: contents,
        user_email: user_email,
        feed_id: feed_id,
      },
    });

    return result;
  }

  async getComments(feed_id: number): Promise<ShowCommentDto[]> {
    // const comments = await this.prismaService.comment.findMany({
    //   where: { feed_id: feed_id },
    // });
    // add user nickname, user image and comment created_at
    const result: ShowCommentDto[] = [];
    try {
      // for (const comment of comments) {
      //   const user = await this.prismaService.user.findUnique({
      //     where: { email: comment.user_email },
      //   });
      //   const showCommentDto: ShowCommentDto = {
      //     id: comment.id,
      //     contents: comment.contents,
      //     nickname: user.nickname,
      //     profile_image: user.image,
      //     createdAt: comment.createdAt,
      //   };
      //   result.push(showCommentDto);
      // }
      const comments = await this.prismaService.comment.findMany({
        where: { feed_id: feed_id },
        include: { user: true },
      });
      for (const comment of comments) {
        const showCommentDto: ShowCommentDto = {
          id: comment.id,
          contents: comment.contents,
          nickname: comment.user.nickname,
          profile_image: comment.user.image,
          createdAt: comment.createdAt,
        };
        result.push(showCommentDto);
      }
    } catch (e) {
      console.log(e);
      return [];
    }
    return result;
  }

  async deleteComment(comment_id: number): Promise<Comment> {
    const result = await this.prismaService.comment.delete({
      where: { id: comment_id },
    });

    return result;
  }
}
