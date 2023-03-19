import { useSetRecoilState, useRecoilValue } from "recoil";
import { currentFeedState, commentReloadState } from "../../atoms/atom";
import { useCookies } from "react-cookie";
import { useRef } from "react";
import axios from "axios";
const host_url = `${process.env.REACT_APP_HOST}/api/comment/create`;

export function CommentInput(props: any) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cookies] = useCookies(["logCookie"]);
  const currentFeed = useRecoilValue(currentFeedState);
  // 코멘트가 입력되었을때 다른 컴포넌트를 리렌더링 시키기위한 상태
  const setcommentReload = useSetRecoilState(commentReloadState);

  const commentAddHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    //인풋 안에 값 비우기
    const formData = new FormData(e.currentTarget);
    const comment = formData.get("comment") as string;

    inputRef.current!.value = "";
    await axios
      .post(
        host_url,
        {
          feed_id: currentFeed.feed_id,
          content: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${cookies.logCookie}`,
          },
        }
      )
      .then(function (response) {
        if (response) {
          // 인풋 값 비우기
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
    <form onSubmit={commentAddHandler} className="flex flex-col mt-7">
      <div className="flex flex-row">
        <img className="w-10 h-10 rounded-full" src={props.userImg} alt="" />
        {/* 좌우로 꽉찬 인풋창*/}
        <div className="w-full mr-3">
          <input
            // onKeyDown={handleKeyPress}
            ref={inputRef}
            name="comment"
            className="w-full h-10 px-3 mt-1 text-base text-gray-700 placeholder-gray-300 border rounded-lg ml-7 focus:shadow-outline"
            type="text"
            placeholder="댓글을 입력하세요"
          ></input>
          {/* 입력버튼 */}
        </div>
        <button
          type="submit"
          value="Submit"
          // onClick={commentAddHandler}
          className="w-1/6 h-10 mt-1 text-base text-white border rounded-lg shadow-md bg-sky-500 ml-7 focus:shadow-outline hover:bg-sky-700 hover:text-gray-200"
        >
          입력
        </button>
      </div>
    </form>
  );
}
