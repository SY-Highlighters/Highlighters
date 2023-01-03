import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Highlight } from '@prisma/client';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { HighlightService } from './highlight.service';

@Controller('api/highlight')
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) {}

  // Create
  @Post('/')
  async createHighlight(
    @Body() createHighlightDto: CreateHighlightDto,
  ): Promise<Highlight> {
    return this.highlightService.createHighlight(createHighlightDto);
  }

  // Read One by ID
  @Get('/:id')
  async findHighlight(@Param('id') id: number): Promise<Highlight> {
    return this.highlightService.findHighlight(id);
  }

  // Read Many by URL
  @Post('/feed')
  async findHighlightAll(@Body('url') url: string): Promise<Highlight[]> {
    return this.highlightService.findAllHighlightInFeed(url);
  }

  // Update
  @Patch('/:id')
  async updateHighlight(
    @Param('id') id: number,
    @Body() updateHighlightDto: UpdateHighlightDto,
  ): Promise<Highlight> {
    return this.highlightService.updateHighlight(id, updateHighlightDto);
  }

  // Delete by ID
  @Delete('/:id')
  async deleteHighlight(@Param('id') id: number): Promise<Highlight> {
    return this.highlightService.deleteHighlight(id);
  }
}
