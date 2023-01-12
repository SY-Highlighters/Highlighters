import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { tagModalVisble, sighUpCheck } from "../../states/atom";
import {
  tagsInFeedState,
  userInfoState,
  currentFeedIdState,
} from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export function CommentInput() {
  const [inputValue, setInputValue] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const currentFeedId = useRecoilValue(currentFeedIdState);

  const handleChange = (e: any) => {
    console.log(e.target.value);
    setInputValue(e.target.value);
  };

  const commentAddHandler = async () => {
    //인풋 안에 값 비우기
    const host_url = `${process.env.REACT_APP_HOST}/api/comment/create/${currentFeedId}`;
    // 서버에 그룹 생성 요청
    await axios
      .post(
        host_url,
        {
          feed_id: currentFeedId,
          contents: inputValue,
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
            title: "댓글 생성 성공!",
            text: "댓글 생성에 성공했습니다.",
          });
          setInputValue(" ");

          //   const newTagItem = {
          //     tag_name: inputValue,
          //     tag_id: response.data.tag_id,
          //   };
          //   setTagList([...tagList, newTagItem]);
        } else {
          alert("댓글 생성 실패!");
        }
      });
  };

  return (
    <div className="flex flex-col mt-7">
      <div className="flex flex-row">
        <img
          className="w-10 h-10 rounded-full"
          src="https://via.placeholder.com/150"
          alt=""
        />
        {/* 좌우로 꽉찬 인풋창*/}
        <div className="w-full mr-3">
          <input
            onChange={handleChange}
            value={inputValue}
            className="w-full h-10 px-3 mt-1 text-base text-gray-700 placeholder-gray-300 border rounded-lg ml-7 focus:shadow-outline"
            type="text"
            placeholder="댓글을 입력하세요"
          ></input>
          {/* 입력버튼 */}
        </div>
        <button
          onClick={commentAddHandler}
          className="w-1/6 h-10 mt-1 text-base text-white border rounded-lg bg-sky-500 ml-7 focus:shadow-outline hover:bg-sky-700 hover:text-gray-200"
        >
          입력
        </button>
      </div>
    </div>
  );
}
