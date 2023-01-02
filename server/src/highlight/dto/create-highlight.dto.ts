import { Prisma } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class CreateHighlightDto {
  @IsNotEmpty()
  feed_id: number;

  @IsNotEmpty()
  user_email: string;

  @IsNotEmpty()
  selection: Prisma.JsonArray;
}
