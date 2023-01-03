import { atom } from "recoil";

export const bookmarkState = atom<boolean>({
  key: "bookmarkState",
  default: true,
});

export const feedState = atom<any>({
  key: "feedState",
  default: [
  ],
});
