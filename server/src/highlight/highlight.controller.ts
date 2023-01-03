import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Highlight, User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { UpdateHighlightDto } from './dto/update-highlight.dto';
import { HighlightService } from './highlight.service';

@Controller('api/highlight')
@UseGuards(AuthGuard())
export class HighlightController {
  constructor(private readonly highlightService: HighlightService) {}

  // Create
  @Post('/')
  async createHighlight(
    @Body() createHighlightDto: CreateHighlightDto,
    @GetUser() user: User,
  ): Promise<Highlight> {
    const user_email = user.email;

    return this.highlightService.createHighlight(
      user_email,
      createHighlightDto,
    );
  }

  // Read One by ID
  @Get('/id/:id')
  async findHighlight(@Param('id') id: number): Promise<Highlight> {
    return this.highlightService.findHighlight(id);
  }

  // Read Many by URL
  @Post('/feed')
  async findHighlightAll(@Body('url') url: string): Promise<Highlight[]> {
    return this.highlightService.findAllHighlightInFeed(url);
  }

  // Update
  @Patch('/update/:id')
  async updateHighlight(
    @Param('id') id: number,
    @Body() updateHighlightDto: UpdateHighlightDto,
  ): Promise<Highlight> {
    return this.highlightService.updateHighlight(id, updateHighlightDto);
  }

  // Delete by ID
  @Delete('/delete/:id')
  async deleteHighlight(@Param('id') id: number): Promise<Highlight> {
    return this.highlightService.deleteHighlight(id);
  }

  @Get('/test')
  async testToken() {
    console.log();
  }
}
