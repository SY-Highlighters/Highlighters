import { IsNotEmpty } from 'class-validator';

export class CreateFeedDto {
  @IsNotEmpty()
  user_email: string;

  @IsNotEmpty()
  group_id: number;

  @IsNotEmpty()
  url: string;
}
