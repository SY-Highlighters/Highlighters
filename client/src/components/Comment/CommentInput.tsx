import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { tagModalVisble, sighUpCheck } from "../../states/atom";
import {
  tagsInFeedState,
  userInfoState,
  currentFeedState,
  commentReloadState,
} from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { useUserData } from "../../hooks/useUserData";
export function CommentInput(props: any) {
  const [inputValue, setInputValue] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const currentFeed = useRecoilValue(currentFeedState);
  // 코멘트가 입력되었을때 다른 컴포넌트를 리렌더링 시키기위한 상태
  const setcommentReload = useSetRecoilState(commentReloadState);
  const handleChange = (e: any) => {
    // console.log(e.target.value);
    setInputValue(e.target.value);
  };
  // 엔터
  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.key === "Enter") {
      commentAddHandler();
    }
  };

  const { data: user, isSuccess, isLoading, error } = useUserData(cookies);

  const commentAddHandler = async () => {
    //인풋 안에 값 비우기
    const host_url = `${process.env.REACT_APP_HOST}/api/comment/create`;
    await axios
      .post(
        host_url,
        {
          feed_id: currentFeed.feed_id,
          content: inputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.logCookie}`,
          },
        }
      )
      .then(function (response) {
        if (response) {
          setInputValue(" ");
          props.onFunc("add");
          setcommentReload((prev) => !prev);

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
        <img className="w-10 h-10 rounded-full" src={user.image} alt="" />
        {/* 좌우로 꽉찬 인풋창*/}
        <div className="w-full mr-3">
          <input
            onKeyDown={handleKeyPress}
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
          className="w-1/6 h-10 mt-1 text-base text-white border rounded-lg shadow-md bg-sky-500 ml-7 focus:shadow-outline hover:bg-sky-700 hover:text-gray-200"
        >
          댓글
        </button>
      </div>
    </div>
  );
}
