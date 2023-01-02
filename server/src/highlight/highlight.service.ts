import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/repository/prisma.service';
import { highlight } from '.prisma/client';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';

@Injectable()
export class HighlightService {
  constructor(private readonly prismaService: PrismaService) {}

  async createHighlight(
    createHighlightDto: CreateHighlightDto,
  ): Promise<highlight> {
    const result = await this.prismaService.highlight.create({
      data: {
        feed_id: createHighlightDto.feed_id,
        user_id: createHighlightDto.user_id,
        selection: {},
      },
    });

    return result;
  }

  async findHighlight(id: number): Promise<highlight> {
    const result = await this.prismaService.highlight.findUnique({
      where: { highlight_id: id },
    });

    if (!result) {
      throw new NotFoundException(`Can't find highlight with id ${id}`);
    }

    return result;
  }

  async findAllHighlightInFeed(feed_id: number): Promise<highlight[]> {
    const result = await this.prismaService.highlight.findMany({
      where: { feed_id },
    });

    return result;
  }

  async updateHighlight(
    id: number,
    updateHighlightDto: UpdateHighlightDto,
  ): Promise<highlight> {
    const result = await this.prismaService.highlight.update({
      where: { highlight_id: id },
      data: updateHighlightDto,
    });

    return result;
  }

  async deleteHighlight(id: number): Promise<highlight> {
    return this.prismaService.highlight.delete({ where: { highlight_id: id } });
  }
}
