export class RequestTagCreateDto {
  tag_name: string;
  feed_id: number;
}

export class RequestTagDeleteDto {
  tag_id: number;
}

export class RequestTagWebDeleteDto {
  tag_name: string;
}
