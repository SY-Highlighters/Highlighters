import { atom } from "recoil";

export const bookmarkState = atom<boolean>({
  key: "bookmarkState",
  default: true,
});
