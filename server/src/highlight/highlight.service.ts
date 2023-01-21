import { User } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  HttpException,
  CACHE_MANAGER,
} from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { Highlight } from '.prisma/client';
import { CreateHighlightDto, UpdateHighlightDto } from './dto/highlight.dto';
import { FeedService } from 'src/feed/feed.service';
import { CreateFeedDto } from 'src/feed/dto/feed.dto';
import { forwardRef } from '@nestjs/common/utils';
import { Inject } from '@nestjs/common/decorators';
import { fetchandsave, deleteS3 } from 'src/util/fetch';
import { Cache } from 'cache-manager';
import { EventGateway } from 'src/event/event.gateway';
import { ElasticsearchService } from 'src/repository/connection';
import { elasticFeedDto } from 'src/repository/dto/elastic.dto';

@Injectable()
export class HighlightService {
  constructor(
    private readonly prismaService: PrismaService,
    private event: EventGateway,
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(forwardRef(() => FeedService))
    private readonly feedService: FeedService,
    private readonly elastic: ElasticsearchService,
  ) {}

  async createHighlight(
    createHighlightDto: CreateHighlightDto,
    user: User,
  ): Promise<Highlight> {
    const {
      user_email,
      group_id,
      url,
      contents,
      selection,
      title,
      image,
      description,
      color,
      type,
    } = createHighlightDto;

    try {
      let find_feed = await this.prismaService.feed.findFirst({
        where: { url, group_id },
      });

      if (!find_feed) {
        const newFeedDto = new CreateFeedDto();
        newFeedDto.url = url;
        newFeedDto.feed_title = title;
        newFeedDto.og_title = title;
        newFeedDto.image = image;
        newFeedDto.description = description;
        newFeedDto.high_content = contents;

        find_feed = await this.feedService.createFeed(newFeedDto, user);
      } else {
        // elastic input
        const elasticFeed = new elasticFeedDto();
        elasticFeed.feed_id = String(find_feed.id);
        elasticFeed.user_nickname = user.nickname;
        elasticFeed.group_id = user.group_id;
        elasticFeed.title = title;
        elasticFeed.url = url;
        elasticFeed.description = description;
        elasticFeed.contents = contents;
        await this.elastic.appendFeed(
          elasticFeed.feed_id,
          elasticFeed.contents,
        );
      }

      let result = null;

      // type 1 일반 글씨 하이라이트
      if (type !== 2) {
        result = await this.prismaService.highlight.create({
          data: {
            feed_id: find_feed.id,
            group_id: group_id,
            user_email: user_email,
            selection: selection,
            contents: contents,
            type: 1,
            color: color,
          },
        });
      } else {
        // type 2 사진 하이라이트
        result = await this.prismaService.highlight.create({
          data: {
            feed_id: find_feed.id,
            group_id: group_id,
            user_email: user_email,
            selection: selection,
            contents: contents, // image source url
            type: 2,
            color: color,
          },
        });

        // // url에서 이미지를 fetch 이후 s3에 업로드
        // await fetchandsave(contents, result.id);
        // // s3 url을 db에 업데이트
        // result = await this.prismaService.highlight.update({
        //   where: { id: result.id },
        //   data: {
        //     contents: `https://highlighters-s3.s3.ap-northeast-2.amazonaws.com/picture/${result.id}.jpg`,
        //   },
        // });
      }
      if (find_feed) {
        await this.prismaService.feed.update({
          where: { id: find_feed.id },
          data: {
            // highlight: { connect: { id: result.id } },
            updatedAt: result.createdAt,
          },
        });
      }

      // websocket으로 보내기
      console.log('===== 하이라이트 =====');
      this.event.group_room[group_id].forEach((client) => {
        if (client['email'] === user_email) return;
        client.send(
          JSON.stringify({
            event: 'highlight',
            data: {
              ...result,
              feed_url: find_feed.url,
            },
          }),
        );
      });

      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async findHighlight(id: number): Promise<Highlight> {
    const result = await this.prismaService.highlight.findUnique({
      where: { id: id },
    });

    if (!result) {
      throw new NotFoundException(`Can't find highlight with id ${id}`);
    }

    return result;
  }

  async findAllHighlightById(id: number): Promise<Highlight[]> {
    const highlights = await this.prismaService.highlight.findMany({
      where: { feed_id: id },
    });

    return highlights;
  }

  async findAllHighlightInFeed(
    group_id: number,
    url: string,
  ): Promise<Highlight[]> {
    const find_feed = await this.prismaService.feed.findFirst({
      where: { url, group_id },
      select: {
        highlight: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!find_feed) {
      throw new NotFoundException(`Can't find feed with url ${url}`);
    }

    return find_feed.highlight;
  }

  async updateHighlight(
    id: number,
    updateHighlightDto: UpdateHighlightDto,
  ): Promise<Highlight> {
    const result = await this.prismaService.highlight.update({
      where: { id: id },
      data: updateHighlightDto,
    });

    return result;
  }

  async deleteHighlight(id: number): Promise<boolean> {
    try {
      const high_contents = await this.prismaService.highlight.update({
        where: { id: id },
        select: { contents: true, feed_id: true },
        data: { contents: '', color: '-1' }, // 삭제된 하이라이트는 color를 -1로 변경
      });

      // const high_contents = await this.prismaService.highlight.delete({
      //   where: { id: id },
      //   select: { contents: true, feed_id: true },
      // });
      // await deleteS3(id);
      // console.log(high_contents);
      await this.elastic.deleteHighlight(
        String(high_contents.feed_id),
        high_contents.contents,
      );
      return true;
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }
}
