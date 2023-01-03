import { IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
  user_email: string;

  group_id: number;

  @IsNotEmpty()
  name: string;
}

export class UpdateGroupDto {
  user_email: string;

  @IsNotEmpty()
  group_id: number;
}
