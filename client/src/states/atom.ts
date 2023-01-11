import { atom } from "recoil";

/* 태그 */
// 태그 클릭시 해당 태그 이름
export const tagNameState = atom<String>({
  key: "tagNameState",
  default: "",
});

// 피드의 태그 리스트
export const tagsInFeedState = atom<any>({
  key: "tagsInFeedState",
  default: [],
});

// 그룹의 전체 태그 리스트
export const tagsInGroupState = atom<any>({
  key: "tagsInGroupState",
  default: [],
});

/* 피드 */
//  그룹 피드 리스트
export const feedsInGroupState = atom<any>({
  key: "feedsInGroupState",
  default: [],
});
// 태그에 해당하는 피드 리스트 => 버리자
export const feedsTagListState = atom<any>({
  key: "feedsTagListState",
  default: [],
});

/* 로그인 */
// 로그인 모달창을 띄우는 state
export const logModalVisble = atom<boolean>({
  key: "logModalVisble",
  default: false,
});
// 로그인 체크하는 state
export const sighUpCheck = atom<boolean>({
  key: "sighUpCheck",
  default: false,
});

// 유저가 그룹이 가입되어있는지 확인하는 state
export const groupJoinState = atom<boolean>({
  key: "groupJoinState",
  default: false,
});

export const groupAddState = atom<boolean>({
  key: "groupAddState",
  default: false,
});
export const groupInviteState = atom<boolean>({
  key: "groupInviteState",
  default: false,
});
// 그룹 모달창을 띄우는 state (그룹 추가, 그룹 초대)
export const groupModalVisble = atom<boolean>({
  key: "groupModalVisble",
  default: false,
});

// 그룹 기능 관련 모달창을 띄우는 state (그룹 추가, 그룹 초대)
export const groupModalState = atom<number>({
  key: "groupModalState",
  default: 0,
});

// 태그 편집 모달창을 띄우는 state
export const tagModalVisble = atom<boolean>({
  key: "tagModalVisble",
  default: false,
});

/* view 전환 */
export const mainSectionState = atom<number>({
  key: "mainSectionState",
  default: 0,
});
/* 유저 정보 */
// 유저 정보 state
export const userInfoState = atom<any>({
  key: "userInfoState",
  default: {
    nickname: "",
    img: "",
    groupName: "",
    groupId: "",
  },
});
/// 쓰레기장
// // 북마크 전환 state
// export const bookmarkState = atom<boolean>({
//   key: "bookmarkState",
//   default: true,
// });
