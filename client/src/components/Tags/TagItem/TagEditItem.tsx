import axios from "axios";
import { useCookies } from "react-cookie";
import { useRecoilState, useRecoilValue } from "recoil";
import { tagsInFeedState, clickedGroupTagDelState } from "../../../states/atom";
export function TagEditItem(props: any) {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [tagList, setTagList] = useRecoilState(tagsInFeedState);
  const clickedGroupTagDel = useRecoilValue(clickedGroupTagDelState);
  const host_url = clickedGroupTagDel
    ? `${process.env.REACT_APP_HOST}/api/tag/web/delete`
    : `${process.env.REACT_APP_HOST}/api/tag/delete`;
  const data = clickedGroupTagDel
    ? { tag_name: props.tagName }
    : {
        tag_id: props.tagId,
      };
  // Todo : 태그 삭제 기능
  const tagEditHandler = async () => {
    console.log("함보자..");
    // 서버에 태그 삭제 요청
    await axios.delete(host_url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.logCookie}`,
      },
      data,
    });
    // 태그 삭제 후 태그 리스트 업데이트
    setTagList(tagList.filter((tag: any) => tag.tag_id !== props.tagId));
  };
  return (
    <span className="mt-2 inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-300">
      #{props.tagName}
      <button onClick={tagEditHandler}>
        <svg
          className="w-4 h-4 ml-2 text-black "
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </span>
  );
}
