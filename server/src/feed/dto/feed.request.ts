import { IsNotEmpty, IsNumber } from 'class-validator';

export class FeedRequestDto {
  @IsNumber()
  @IsNotEmpty()
  group_id: number;
}
