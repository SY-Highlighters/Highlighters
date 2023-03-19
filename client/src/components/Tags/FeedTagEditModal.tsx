import {
  useSetRecoilState,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import { tagModalVisble, sighUpCheck } from "../../atoms/atom";
import {
  tagsInFeedState,
  currentFeedState,
  tagsCreateState,
  tagsDelState,
} from "../../atoms/atom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { TagEditItem } from "./TagItem/TagEditItem";
import Swal from "sweetalert2";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import GroupTagList from "../User/GroupTagList";

export function FeedTagEditModal(props: any) {
  const setTagModal = useSetRecoilState(tagModalVisble);
  const currentFeed = useRecoilValue(currentFeedState);
  // console.log("이거임", currentFeed);
  // 그룹 태그 리스트 전역
  const [cookies] = useCookies(["logCookie"]);
  const [inputValue, setInputValue] = useState("");
  // const tagName = useRecoilValue(tagNameState);
  const [tagList, setTagList] = useRecoilState(tagsInFeedState);
  const [tagsCreate, setTagsCreate] = useRecoilState(tagsCreateState);
  const [tagsDel, setTagsDel] = useRecoilState(tagsDelState);
  const resetTagsInFeedState = useResetRecoilState(tagsInFeedState);
  const resetCreTags = useResetRecoilState(tagsCreateState);
  const resetDelTags = useResetRecoilState(tagsDelState);

  const closeModal = () => {
    setTagModal(0);
    resetCreTags();
    resetDelTags();
    resetTagsInFeedState();
    // 새로고침하고 원래 스크롤로 이동함
  };

  const handleChange = (e: any) => {
    setInputValue(e.target.value);
  };

  // 엔터 입력시 태그 추가
  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter") {
      tagAddHandler();
    }
  };

  // 엔터나 버튼 클릭시 태그 추가
  const tagAddHandler = async () => {
    if (inputValue === "" || inputValue.trim() === "") {
      return;
    }
    // 태그 중복 체크
    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tag_name === inputValue) {
        Swal.fire({
          icon: "error",
          title: "태그 중복",
          text: "이미 존재하는 태그입니다.",
          showConfirmButton: false,
          timer: 500,
        });
        return;
      }
    }
    // if
    const newTagItem = {
      tag_name: inputValue,
    };
    // 생성 태그 리스트에 추가
    setTagList([...tagList, newTagItem]);
    setTagsCreate([...tagsCreate, newTagItem]);
    setInputValue("");
  };
  // console.log("태그리스트", tagList);
  const tagLists = tagList.map((tagItem: any) => (
    <div key={tagItem.tag_name}>
      <TagEditItem
        key={tagItem.tag_id}
        tagName={tagItem.tag_name}
        feedId={currentFeed.feed_id}
        tagId={tagItem.tag_id}
        // tagList={tagList}
      />
    </div>
  ));

  // tagsDel의 id 값만 리스트로 만들기
  const tagDelList = tagsDel.map((tagItem: any) => tagItem.tag_id);
  const tagCreList = tagsCreate.map((tagItem: any) => tagItem.tag_name);

  const tagSaveHandler = async () => {
    if (tagCreList.length === 0 && tagDelList.length === 0) {
      closeModal();
    } else {
      const host_url = `${process.env.REACT_APP_HOST}/api/tag/update`;
      await axios
        .post(
          host_url,
          {
            delete_tag_id: tagDelList,
            create_tag_name: tagCreList,
            feed_id: currentFeed.feed_id,
          },
          {
            headers: {
              Authorization: `Bearer ${cookies.logCookie}`,
            },
          }
        )
        .then(function (response) {
          if (response) {
            // 모달 닫기
            closeModal();
            // 편집 안했을때는 새고 안하기
            window.location.reload();
          } else {
            alert("태그 편집 실패!");
          }
        });
    }
  };

  return (
    <div
      className="fixed z-10 overflow-y-auto inset-1"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 모달 배경 */}
        <div
          className="fixed inset-0 transition-opacity bg-transparent bg-opacity-75"
          aria-hidden="true"
          onClick={closeModal}
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
            <div className="flex flex-row">
              <h1 className="ml-2 text-2xl font-semibold text-left text-sky-500 ">
                태그 수정
              </h1>
            </div>
            <div className="mt-2 ml-2 text-xl text-semibold text-sky-700">
              <span>{currentFeed.feed_title.slice(0, 40)}...</span>
            </div>
            <div className="flex flex-wrap mt-2 ml-2">{tagLists}</div>
            {/* 태그 생성 */}
            <div className="flex flex-wrap mt-5">
              <div className="w-full px-2">
                {/* 입력창 안에 화살표 버튼 넣기 */}
                <div className="flex flex-row items-center justify-between w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400">
                  <input
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    type="text"
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="태그를 입력하세요"
                    value={inputValue}
                  />
                  <div>
                    <button onClick={tagAddHandler} className="">
                      <ArrowRightCircleIcon
                        className={
                          inputValue
                            ? "flex-shrink-0 mt-2 ml-3 text-sky-400 w-7 h-7 hover:text-sky-500"
                            : "flex-shrink-0 mt-2 ml-3 text-gray-400 w-7 h-7 hover:text-sky-500"
                        }
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 검색창 미리보기 형식으로 태그 리스트 */}
            <div>
              <div className="flex justify-center mt-5 ml-2">
                <GroupTagList
                  onFunc={() => {
                    // console.log("test");
                  }}
                  onCss={"w-full mt-10 bg-white"}
                ></GroupTagList>
              </div>
            </div>
            {/* 태그 저장 버튼 */}
            <div className="flex flex-wrap mt-5">
              <div className="w-full px-2">
                <button
                  onClick={tagSaveHandler}
                  className="w-full px-4 py-2 text-white rounded-lg bg-sky-500 hover:bg-sky-600 focus:outline-none"
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
