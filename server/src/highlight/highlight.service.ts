import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { Highlight } from '.prisma/client';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { FeedService } from 'src/feed/feed.service';
import { CreateFeedDto } from 'src/feed/dto/feed.dto';

@Injectable()
export class HighlightService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly feedService: FeedService,
  ) {}

  async createHighlight(
    createHighlightDto: CreateHighlightDto,
  ): Promise<Highlight> {
    const { url, contents, selection } = createHighlightDto;

    let find_feed = await this.feedService.findFeedByURL(url);

    if (!find_feed) {
      const newFeedDto = new CreateFeedDto();
      newFeedDto.user_email = 'siaksiak@jungle.com';
      newFeedDto.group_id = 1;
      newFeedDto.url = url;

      find_feed = await this.feedService.createFeed(newFeedDto);
    }

    const result = await this.prismaService.highlight.create({
      data: {
        feed_id: find_feed.id,
        user_email: 'siaksiak@jungle.com',
        selection: selection,
        contents: contents,
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

  async findAllHighlightInFeed(url: string): Promise<Highlight[]> {
    const find_feed = await this.feedService.findFeedByURL(url);

    if (!find_feed) {
      throw new NotFoundException();
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
