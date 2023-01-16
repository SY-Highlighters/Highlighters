import { atom } from "recoil";

// 피드 안의 태그 리스트
export const tagsInFeedState = atom<any>({
  key: "tagsInFeedState",
  default: [],
});

// 피드 생성 state
export const feedGenerateState = atom<any>({
  key: "feedGenerateState",
  default: [false],
});

