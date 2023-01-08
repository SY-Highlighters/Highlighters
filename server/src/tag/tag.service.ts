import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { CreateTagDto } from './dto/tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTag(createTagDto: CreateTagDto): Promise<null> {
    const { tag_name, feed_id, group_id } = createTagDto;
    try {
      await this.prismaService.tag.create({
        data: {
          tag_name: tag_name,
          feed: {
            connect: {
              id: feed_id,
            },
          },
          group: {
            connect: {
              id: group_id,
            },
          },
        },
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Internal Server Error', 500);
    }

    return null;
  }
}
