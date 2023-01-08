import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { Highlight } from '.prisma/client';
import { CreateHighlightDto, UpdateHighlightDto } from './dto/highlight.dto';
import { FeedService } from 'src/feed/feed.service';
import { CreateFeedDto } from 'src/feed/dto/feed.dto';
import { forwardRef } from '@nestjs/common/utils';
import { Inject } from '@nestjs/common/decorators';

@Injectable()
export class HighlightService {
  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => FeedService))
    private readonly feedService: FeedService,
  ) {}

  async createHighlight(
    createHighlightDto: CreateHighlightDto,
  ): Promise<Highlight> {
    const { user_email, group_id, url, contents, selection, title } =
      createHighlightDto;

    let find_feed = await this.feedService.findFeedByURL(url);

    if (!find_feed) {
      const newFeedDto = new CreateFeedDto();
      newFeedDto.user_email = user_email;
      newFeedDto.group_id = group_id;
      newFeedDto.url = url;
      newFeedDto.title = title;

      find_feed = await this.feedService.createFeed(newFeedDto);
    }

    const result = await this.prismaService.highlight.create({
      data: {
        feed_id: find_feed.id,
        user_email: user_email,
        selection: selection,
        contents: contents,
        type: 1,
        color: '#FF0000',
      },
    });

    return result;
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

  async findAllHighlightInFeed(url: string): Promise<Highlight[]> {
    const find_feed = await this.feedService.findFeedByURL(url);

    if (!find_feed) {
      // throw new NotFoundException();
      return null;
    }

    const result = await this.prismaService.highlight.findMany({
      where: { feed_id: find_feed.id },
    });

    return result;
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

  async deleteHighlight(id: number): Promise<Highlight> {
    return this.prismaService.highlight.delete({ where: { id: id } });
  }
}
