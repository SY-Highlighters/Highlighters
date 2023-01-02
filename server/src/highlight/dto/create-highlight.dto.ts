import { IsNotEmpty } from 'class-validator';

export class CreateHighlightDto {
  @IsNotEmpty()
  feed_id: number;

  @IsNotEmpty()
  user_id: number;
}
