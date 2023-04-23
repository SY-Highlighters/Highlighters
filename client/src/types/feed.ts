import { UserInfo } from "./user";
import { TagInfo } from "./tag";
export interface FeedInfo {
  id: number;
  title: string;
  og: OgInfo;
  url: string;
  comment: Comment[];
  highlight: Highlight[];
  createdAt: string;
  tag: TagInfo[];
  user: UserInfo;
  bookmark: number[];
  summary: string;
}
export interface OgInfo {
  title: string;
  description: string;
  image: string;
  id: number;
}

export interface Highlight {
  color: string;
  contents: string;
  createdAt: string;
  feed_id: number;
  group_id: number;
  id: number;
  type: number;
  user: UserInfo;
}

export interface Comment{
  contents: string;
  createdAt: string;
  feed_id: number;
  id: number;
  user_email: string;
}
