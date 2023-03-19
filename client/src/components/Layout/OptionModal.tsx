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
} from "../../atoms/atom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  ArrowPathIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { optionModalToggleState } from "../../atoms/atom";
import { useRef } from "react";
export function OptionModal(props: any) {
  // const setTagModal = useSetRecoilState(tagModalVisble);
  const currentFeedId = useRecoilValue(currentFeedState);
  const [optionModalToggle, setOptionModalToggle] = useRecoilState(
    optionModalToggleState
  );
  // 그룹 태그 리스트 전역
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [inputValue, setInputValue] = useState("");
  // const tagName = useRecoilValue(tagNameState);
  const [tagList, setTagList] = useRecoilState(tagsInFeedState);
  const resetTagsInFeedState = useResetRecoilState(tagsInFeedState);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeModal = () => {
    setOptionModalToggle(!optionModalToggle);
    resetTagsInFeedState();
    window.location.reload();
  };
  // const [userData, setUserInfo] = useRecoilState(userInfo); test1 -> 현재 로그인시 유저데이터 받는중

  // const gropuId = userData.groupId;
  // // 렌더링된 후 바로 실행
  //   console.log("여기는 태그모달임", props.tag);
  //   const tagLists = props.tag.map((tagItem: any) => (
  //     <TagEditItem tagName={tagItem.tag_name} />
  //   ));

  const handleChange = (e: any) => {
    // console.log(e.target.value);
    setInputValue(e.target.value);
  };

  const tagAddHandler = async () => {
    const host_url = `${process.env.REACT_APP_HOST}/api/tag/create`;
    await axios
      .post(
        host_url,
        {
          tag_name: inputValue,
          feed_id: currentFeedId,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.logCookie}`,
          },
        }
      )
      .then(function (response) {
        if (response) {
          Swal.fire({
            icon: "success",
            title: "태그 생성 성공!",
            text: "태그 생성에 성공했습니다.",
          });
          const newTagItem = {
            tag_name: inputValue,
            tag_id: response.data.id,
          };
          // console.log(response);
          setTagList([...tagList, newTagItem]);
        } else {
          alert("태그 생성 실패!");
        }
      });
  };

  return (
    <div
      className="fixed z-10 overflow-y-auto inset-1"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* 모달 배경 수정 여기 */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-200 bg-opacity-75"
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
              설정
            </h1>
          </div>
          <div className="flex flex-col m-3 space-y-3">
            <div className="flex justify-center">
              <h1 className="text-xl font-bold text-center text-sky-500">
                프로필
              </h1>
            </div>
            {/* 프사 변경*/}
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <img
                  className="object-cover w-20 h-20 mx-auto rounded-full shadow"
                  src={props.userImg}
                  alt="avatar"
                />
                <div className="absolute bottom-0 right-0 p-1 m-1 bg-white rounded-full shadow">
                  <ArrowPathIcon
                    onClick={() => inputRef.current?.click()}
                    className="w-5 h-5 text-gray-400 transition duration-150 transform rounded-full cursor-pointer hover:text-gray-600 hover:scale-110"
                  ></ArrowPathIcon>
                  {/* 파일 업로드 */}
                  <input type="file" className="hidden" ref={inputRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
