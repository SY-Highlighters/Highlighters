import { atom } from "recoil";
import { TagInfo } from "../types/tag";
// 태그 클릭시 해당 태그 정보
export const activeTag = atom<TagInfo>({
  key: "activeTag",
  default: {
    tag_id: 0,
    tag_name: "",
  },
});