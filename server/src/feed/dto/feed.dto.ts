import { IsNotEmpty } from 'class-validator';

export class CreateFeedDto {
  user_email: string;

  group_id: number;

  @IsNotEmpty()
  url: string;
}
