import axios from "axios";
import { useCookies } from "react-cookie";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tagsInFeedState,
  clickedGroupTagDelState,
  tagsCreateState,
  tagsDelState,
} from "../../../states/atom";
import Swal from "sweetalert2";
import { useMutation } from "react-query";
export function TagEditItem(props: any) {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [tagList, setTagList] = useRecoilState(tagsInFeedState);
  const clickedGroupTagDel = useRecoilValue(clickedGroupTagDelState);
  const [tagsCreate, setTagsCreate] = useRecoilState(tagsCreateState);
  const [tagsDel, setTagsDel] = useRecoilState(tagsDelState);
  const host_url = clickedGroupTagDel
    ? `${process.env.REACT_APP_HOST}/api/tag/web/delete`
    : `${process.env.REACT_APP_HOST}/api/tag/delete`;
  const data = clickedGroupTagDel
    ? { tag_name: props.tagName }
    : {
        tag_id: props.tagId,
      };
  // Todo : 태그 삭제 기능
  // const tagEditHandler = () => {
  //   // 서버에 태그 삭제 요청

  //   setTagList(tagList.filter((tag: any) => tag.tag_id !== props.tagId));
  //   // window.location.reload();
  // };

  const delClickHandler = () => {
    if (props.tagId) {
      // 삭제 태그리스트에 추가
      const delTag = {
        tag_id: props.tagId,
        tag_name: props.tagName,
      };
      setTagsDel([...tagsDel, delTag]);
      setTagList(tagList.filter((tag: any) => tag.tag_id !== props.tagId));
    } else {
      setTagList(tagList.filter((tag: any) => tag.tag_name !== props.tagName));
      // 생성 태그리스트에서 삭제
      setTagsCreate(
        tagsCreate.filter((tag: any) => tag.tag_name !== props.tagName)
      );
    }
  };

  return (
    <span className="mt-2 inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-300">
      #{props.tagName}
      <button onClick={delClickHandler}>
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
