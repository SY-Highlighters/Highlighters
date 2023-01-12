import { Highcomment } from './../../node_modules/.prisma/client/index.d';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/repository/prisma.service';
import { RequesthighcommentDto } from './dto/highcomment.dto';

@Injectable()
export class HighcommentService {
  constructor(private readonly prismaService: PrismaService) {}

  async createHighlightComment(
    user: User,
    requesthighcommentdto: RequesthighcommentDto,
  ): Promise<Highcomment> {
    const { contents, highlight_id } = requesthighcommentdto;
    return this.prismaService.highcomment.create({
      data: {
        contents: contents,
        user_email: user.email,
        highlight_id: highlight_id,
      },
    });
  }
}
