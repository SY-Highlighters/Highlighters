import { atom } from "recoil";

// 그룹의 전체 피드 리스트
export const tagsInFeedState = atom<any>({
  key: "tagsInFeedState",
  default: [],
});
