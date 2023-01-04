import { atom } from "recoil";

export const bookmarkState = atom<boolean>({
  key: "bookmarkState",
  default: true,
});

export const feedState = atom<any>({
  key: "feedState",
  default: [],
});

export const logModalVisble = atom<boolean>({
  key: "logModalVisble",
  default: false,
});

export const sighUpCheck = atom<boolean>({
  key: "sighUpCheck",
  default: false,
});
