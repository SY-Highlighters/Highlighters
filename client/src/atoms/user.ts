import { atom } from "recoil";
interface UserInfo {
    nickname: string;
    img: string;
    groupName: string;
    groupId: string;
}
// 유저 정보 state
export const userInfo = atom<UserInfo>({
  key: "userInfo",
  default: {
    nickname: "",
    img: "",
    groupName: "",
    groupId: "",
  },
});