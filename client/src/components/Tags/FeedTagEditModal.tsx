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
import { GrouptagList } from "../User/GroupTagList";
import AWS from "aws-sdk";
AWS.config.update({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: `${process.env.REACT_APP_S3_ACCESS_KEY_ID}`,
    secretAccessKey: `${process.env.REACT_APP_S3_SECRET_ACCESS_KEY}`,
  },
});
export function FeedTagEditModal(props: any) {
  const setTagModal = useSetRecoilState(tagModalVisble);
  const currentFeedId = useRecoilValue(currentFeedIdState);
  // 그룹 태그 리스트 전역
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [inputValue, setInputValue] = useState("");
  // const tagName = useRecoilValue(tagNameState);
  const [tagList, setTagList] = useRecoilState(tagsInFeedState);
  const resetTagsInFeedState = useResetRecoilState(tagsInFeedState);
  const [imgUrl, setImgUrl] = useState("");

  // // s3 설정
  // const s3 = new AWS.S3();

  // const params = {
  //   Bucket: "highlighters-s3",
  //   Key: "picture/345.jpg",
  // };
  // s3.getObject(params, function (err, data) {
  //   if (err) {
  //     console.log(err, err.stack);
  //   } else {
  //     const imgUrl = URL.createObjectURL(
  //       new Blob([data.Body], { type: "image/png" })
  //     );
  //     setImgUrl(imgUrl);
  //     console.log(imgUrl);
  //     console.log("suc", data);
  //   }
  // });
  const closeModal = () => {
    setTagModal(0);
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

  const tagAddHandler = async () => {
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
        setInputValue("");
        return;
      }
    }

    // const host_url = `${process.env.REACT_APP_HOST}/api/tag/create`;
    // await axios
    //   .post(
    //     host_url,
    //     {
    //       tag_name: inputValue,
    //       feed_id: currentFeedId,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${cookies.logCookie}`,
    //       },
    //     }
    //   )
    //   .then(function (response) {
    //     if (response) {
    //       Swal.fire({
    //         icon: "success",
    //         title: "태그 생성 성공!",
    //         text: "태그 생성에 성공했습니다.",
    //       });
    //       const newTagItem = {
    //         tag_name: inputValue,
    //         tag_id: response.data.id,
    //       };
    //       setInputValue("");
    //       setTagList([...tagList, newTagItem]);
    //     } else {
    //       alert("태그 생성 실패!");
    //     }
    //   });
    const newTagItem = {
      tag_name: inputValue,
    };
    setInputValue("");
    setTagList([...tagList, newTagItem]);
  };

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

  // s3에서 이미지 가져오기
  // const [imgUrl, setImgUrl] = useState("");
  // const s3 = new AWS.S3();

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
                        className="flex-shrink-0 mt-2 ml-3 text-gray-400 w-7 h-7 hover:text-sky-500"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 검색창 미리보기 형식으로 태그 리스트 */}
            <div>
              <div className="flex flex-wrap mt-5">
                <GrouptagList
                  onFunc={() => {
                    console.log("test");
                  }}
                  onCss={"w-full mt-10 bg-white"}
                ></GrouptagList>
              </div>
            </div>
            {/* <a
              href="#"
              onClick={() => {
                const newWindow = window.open(
                  "https://search.naver.com/search.naver?ie=UTF-8&sm=whl_hty&query=%E3%85%9C%E3%85%81%E3%85%8D",
                  "new window"
                );
                newWindow!.onload = () => {
                  newWindow!.scrollTo(0, 15);
                };
              }}
            >
              Go to Scroll Position
            </a> */}
            {/* <img src={imgUrl} className="w-full h-full"></img> */}
          </div>
        </div>
      </div>
    </div>
  );
}
