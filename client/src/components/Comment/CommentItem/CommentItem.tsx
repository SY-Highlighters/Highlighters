import {
  tagsInFeedState,
  userInfoState,
  currentFeedIdState,
} from "../../../states/atom";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

export function CommentItem(props: any) {
  const currentFeedId = useRecoilValue(currentFeedIdState);
  const date = new Date(props.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const min = date.getMinutes();
  // console.log(props.writer, props.userId);
  return (
    <div className="flex flex-col mt-7">
      <div className="flex flex-row">
        <img className="w-10 h-10 rounded-full" src={props.profileImg} alt="" />
        <div className="flex flex-col ml-7">
          <div className="flex flex-row">
            <div className="font-bold">{props.writer}</div>
            {/* extra */}
            {/* 날짜는 위로, 시간은 아래로 표시 */}
            <div className="mt-1 ml-2 text-xs text-gray-500">
              {` ${year}년 ${month}월 ${day}일. ${hours}시 ${min}분`}
            </div>
          </div>
          <div className="text-sm text-gray-700">{props.content}</div>
          {/* extra */}
          {/* <div className="flex flex-row mt-2">
                <div className="text-xs text-gray-500">좋아요</div>
                <div className="ml-2 text-xs text-gray-500">답글</div>
              </div> */}
          {props.userId === props.writer && (
            <div className="-mt-1">
              <button className="text-xs text-gray-500 hover:text-gray-600">
                수정
              </button>
              <button className="ml-1 text-xs text-gray-500 hover:text-gray-600">
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
