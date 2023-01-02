import { IsNotEmpty, IsNumber } from 'class-validator';

export class FeedWithOgDto {
  id: number;
  group_id: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  user_email: string;
  og_title: string;
  og_desc: string;
  og_image: string;
}
