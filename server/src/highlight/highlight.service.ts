import { User } from '@prisma/client';
import {
  Injectable,
  NotFoundException,
  HttpException,
  CACHE_MANAGER,
} from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { Highlight } from '.prisma/client';
import {
  CreateHighlightDto,
  DeleteHighlightDto,
  UpdateHighlightDto,
} from './dto/highlight.dto';
import { FeedService } from 'src/feed/feed.service';
import { CreateFeedDto } from 'src/feed/dto/feed.dto';
import { forwardRef } from '@nestjs/common/utils';
import { Inject, Post } from '@nestjs/common/decorators';
// import { fetchandsave, deleteS3 } from 'src/util/fetch';
import { Cache } from 'cache-manager';
import { EventGateway } from 'src/event/event.gateway';
import { ElasticsearchService } from 'src/repository/connection';
import { elasticFeedDto } from 'src/repository/dto/elastic.dto';
import { deleteS3, fetchandsave } from 'src/util/fetch';
import { response } from 'express';
@Injectable()
export class HighlightService {
  constructor(
    private readonly prismaService: PrismaService,
    private event: EventGateway,
    // @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @Inject(forwardRef(() => FeedService))
    private readonly feedService: FeedService, // private readonly elastic: ElasticsearchService,
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
        newFeedDto.type = type;
        newFeedDto.color = color;

        find_feed = await this.feedService.createFeed(newFeedDto, user);
      } else {
        // // elastic input
        // const elasticFeed = new elasticFeedDto();
        // elasticFeed.feed_id = String(find_feed.id);
        // if (type == 1) {
        //   elasticFeed.contents = contents;
        // } else {
        //   elasticFeed.contents = '';
        // }
        // const extracontents = `${color}-${elasticFeed.contents}`;
        // this.elastic.appendFeed(elasticFeed.feed_id, extracontents);
      }

      let result = null;

      if (type != 2) {
        // type 1 일반 글씨 하이라이트
        result = await this.prismaService.highlight.create({
          data: {
            feed_id: find_feed.id,
            group_id: group_id,
            user_email: user_email,
            selection: selection,
            contents: contents,
            type: type,
            color: color,
          },
        });
      } else {
        const image_content = `${group_id}${find_feed.id}${Date.now()}`;
        // type 2 이미지 하이라이트
        result = await this.prismaService.highlight.create({
          data: {
            feed_id: find_feed.id,
            group_id: group_id,
            user_email: user_email,
            selection: selection,
            contents: `https://highlighters-s3.s3.ap-northeast-2.amazonaws.com/picture/${image_content}.jpg`,
            type: type,
            color: color,
          },
        });
        const post_body = {
          image: {
            URL: contents,
            name: `${image_content}`,
          },
        };
        const post_body_1 = JSON.stringify(post_body);
        fetch(process.env.LAMBDA_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: post_body_1,
        });
        console.log('===== 이미지 업로드 완료 =====');
      }

      await this.prismaService.feed.update({
        where: { id: find_feed.id },
        data: {
          updatedAt: result.createdAt,
        },
      });

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

  async deleteHighlight(
    deleteHighlightDto: DeleteHighlightDto,
  ): Promise<boolean> {
    const { id, type } = deleteHighlightDto;
    try {
      // 하이라이트 삭제
      let high_contents;
      if (type == 1) {
        const high_find = await this.prismaService.highlight.findUnique({
          where: { id: id },
        });
        // 텍스트 하이라이트 삭제
        high_contents = await this.prismaService.highlight.update({
          where: { id: id },
          select: { contents: true, feed_id: true },
          data: { contents: '', color: '-1' }, // 삭제된 하이라이트는 color를 -1로 변경
        });

        // const extracontents = `${high_find.color}-${high_find.contents}`;
        // // elastic 삭제
        // await this.elastic.deleteHighlight(
        //   String(high_contents.feed_id),
        //   extracontents,
        // );
      } else if (type == 2) {
        // 사진 하이라이트 삭제
        high_contents = await this.prismaService.highlight.delete({
          where: { id: id },
          select: { contents: true, feed_id: true },
        });
        await deleteS3(id);
      } else {
        high_contents = await this.prismaService.highlight.delete({
          where: { id: id },
          select: { contents: true, feed_id: true },
        });
      }

      return true;
    } catch (error) {
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async upload_url(url: string) {
    const post_body = {
      image: {
        URL: url,
        name: 'image_content',
      },
    };
    const post_body_1 = JSON.stringify(post_body);
    const result = await fetch(process.env.LAMBDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: post_body_1,
    });
    const response = await result.json();
    return response;
  }
}
