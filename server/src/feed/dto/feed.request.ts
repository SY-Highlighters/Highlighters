import { IsNotEmpty, IsNumber } from 'class-validator';

export class FeedRequestDto {
  @IsNumber()
  @IsNotEmpty()
  group_id: number;
}

export class FeedOgDto {
  @IsNotEmpty()
  og_title: string;
  @IsNotEmpty()
  og_desc: string;
  @IsNotEmpty()
  og_image: string;
}
