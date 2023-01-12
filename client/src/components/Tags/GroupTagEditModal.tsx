import {
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import { tagModalVisble, sighUpCheck } from "../../states/atom";
import {
  tagsInFeedState,
  userInfoState,
  currentFeedIdState,
} from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { TagEditItem } from "./TagItem/TagEditItem";
import Swal from "sweetalert2";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import GroupTag from "../User/GroupTag";
export function GroupTagEditModal(props: any) {
  const setTagModal = useSetRecoilState(tagModalVisble);
  const currentFeedId = useRecoilValue(currentFeedIdState);
  // 그룹 태그 리스트 전역
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [inputValue, setInputValue] = useState("");
  // const tagName = useRecoilValue(tagNameState);
  const [tagList, setTagList] = useRecoilState(tagsInFeedState);
  const resetTagsInFeedState = useResetRecoilState(tagsInFeedState);

  const closeModal = () => {
    setTagModal(0);
    resetTagsInFeedState();
  };
  // const [userData, setUserInfo] = useRecoilState(userInfo); test1 -> 현재 로그인시 유저데이터 받는중

  // const gropuId = userData.groupId;
  // // 렌더링된 후 바로 실행
  //   console.log("여기는 태그모달임", props.tag);
  //   const tagLists = props.tag.map((tagItem: any) => (
  //     <TagEditItem tagName={tagItem.tag_name} />
  //   ));

  const tagLists = tagList.map((tagItem: any) => (
    <div key={tagItem.tag_id}>
      <TagEditItem
        key={tagItem.tag_id}
        tagName={tagItem.tag_name}
        feedId={currentFeedId}
        tagId={tagItem.tag_id}
        // tagList={tagList}
      />
    </div>
  ));

  return (
    <div
      className="fixed z-10 overflow-y-auto inset-1"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-transparent bg-opacity-75"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {/* 닫기 버튼*/}
          <button
            onClick={closeModal}
            className="absolute top-0 right-0 z-10 p-2 m-2 text-gray-400 transition-colors duration-200 transform rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:bg-gray-100 focus:text-gray-600"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {/* 모달 안 내용 */}
          <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
            <h1 className="text-3xl font-semibold text-left text-sky-500 ">
              태그 수정
            </h1>

            <div className="flex flex-wrap mt-2 ">{tagLists}</div>

            {/* 검색창 미리보기 형식으로 태그 리스트 */}
            <div>
              <GroupTag
                onFunc={() => {
                  console.log("test");
                }}
                onCss={"w-full mt-10 bg-white"}
              ></GroupTag>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}