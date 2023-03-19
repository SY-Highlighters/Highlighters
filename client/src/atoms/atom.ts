import { atom } from "recoil";


// 피드의 태그 리스트
export const tagsInFeedState = atom<any>({
  key: "tagsInFeedState",
  default: [],
});


// 태그 삭제 (그룹 태그 삭제시)
export const clickedGroupTagDelState = atom<any>({
  key: "clickedGroupTagDelState",
  default: false,
});
/* 피드 */
//  그룹 피드 리스트
export const feedsInGroupState = atom<[]>({
  key: "feedsInGroupState",
  default: [],
});
// 태그에 해당하는 피드 리스트 => 버리자
export const feedsTagListState = atom<[]>({
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

// 태그 편집 모달창을 띄우는 state(disabled(0), 피드별(1),그룹별(2))
export const tagModalVisble = atom<number>({
  key: "tagModalVisble",
  default: 0,
});

/* view 전환 */
export const mainSectionState = atom<number>({
  key: "mainSectionState",
  default: 0,
});
/* 유저 정보 */


export const currentFeedState = atom<{ feed_id: number; feed_title: string }>({
  key: "currentFeedState",
  default: {
    feed_id: 0,
    feed_title: "",
  },
});

/// 쓰레기장
// // 북마크 전환 state
// export const bookmarkState = atom<boolean>({
//   key: "bookmarkState",
//   default: true,
// });

// 코멘트 작성시 코멘트 리스트 리로드 state
export const commentReloadState = atom<boolean>({
  key: "commentReloadState",
  default: false,
});

export const optionModalToggleState = atom<boolean>({
  key: "optionModalToggleState",
  default: false,
});

export const selectedDayState = atom<Date>({
  key: "selectedDayState",
  default: new Date(),
});

export const changeMainSectionState = atom<boolean>({
  key: "changeMainSectionState",
  default: false,
});

export const groupMemberVisibleState = atom<boolean>({
  key: "groupMemberVisibleState",
  default: false,
});

export const searchKeywordState = atom<string>({
  key: "searchKeywordState",
  default: "",
});

export const tagsCreateState = atom<any>({
  key: "tagsCreateState",
  default: [],
});

export const tagsDelState = atom<any>({
  key: "tagsDelState",
  default: [],
});

export const GroupTagListState = atom<any>({
  key: "GroupTagListState",
  default: [],
});

export const reloadNotiState = atom<boolean>({
  key: "reloadNotiState",
  default: false,
});

export const testNoti = atom<any>({
  key: "testNoti",
  default: [],
});




