import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateFeedDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  feed_title: string;

  @IsString()
  @IsNotEmpty()
  og_title: string;

  image: string;

  description?: string;

  tag_name?: string[];

  high_content?: string;

  type?: number;
  color?: string;
}

// export class getfeedDto {
//   @IsNumber()
//   @IsNotEmpty()
//   page: number;

//   @IsNumber()
//   @IsNotEmpty()
//   take: number;
// }
