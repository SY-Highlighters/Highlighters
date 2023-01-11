import {
  tagsInFeedState,
  userInfoState,
  currentFeedIdState,
} from "../../../states/atom";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";

export function CommentItem() {
  const currentFeedId = useRecoilValue(currentFeedIdState);
  
  return (
    <div className="flex flex-col mt-7">
      <div className="flex flex-row">
        <img
          className="w-10 h-10 rounded-full"
          src="https://via.placeholder.com/150"
          alt=""
        />
        <div className="flex flex-col ml-7">
          <div className="flex flex-row">
            <div className="font-bold">박예린</div>
            {/* extra */}
            {/* <div className="ml-2 text-xs text-gray-500">1시간 전</div> */}
          </div>
          <div className="text-sm text-gray-700">모시깽 모시깽</div>
          {/* extra */}
          {/* <div className="flex flex-row mt-2">
                <div className="text-xs text-gray-500">좋아요</div>
                <div className="ml-2 text-xs text-gray-500">답글</div>
              </div> */}
        </div>
      </div>
    </div>
  );
}
