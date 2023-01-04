import { atom } from "recoil";

export const bookmarkState = atom<boolean>({
  key: "bookmarkState",
  default: true,
});

export const feedState = atom<any>({
  key: "feedState",
  default: [
    {
      id: "1",
      title: "더미1",
      description: "더미1",
      highlight: ["바보", "멍청이"],
      Date: "2021-01-01",
    },
  ],
});


export const logModalVisble = atom<boolean>({
  key: "logModalVisble",
  default: false,
});



export const sighUpCheck = atom<boolean>({
  key: "sighUpCheck",
  default: false,
});
