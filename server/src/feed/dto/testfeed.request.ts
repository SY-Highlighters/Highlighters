import { IsString, IsNotEmpty } from 'class-validator';

export class TestFeedRequestDto {
  @IsString()
  @IsNotEmpty()
  group: string;
}
