import { useRecoilState, useRecoilValue } from "recoil";
import {
  tagsInFeedState,
  clickedGroupTagDelState,
  tagsCreateState,
  tagsDelState,
} from "../../../atoms/atom";

export function TagEditItem(props: any) {
  const [tagsDel, setTagsDel] = useRecoilState(tagsDelState);
  const [tagList, setTagList] = useRecoilState(tagsInFeedState);
  const clickedGroupTagDel = useRecoilValue(clickedGroupTagDelState);
  const [tagsCreate, setTagsCreate] = useRecoilState(tagsCreateState);
  // const [tagsDel, setTagsDel] = useRecoilState(tagsDelState);
  // const host_url = clickedGroupTagDel
  //   ? `${process.env.REACT_APP_HOST}/api/tag/web/delete`
  //   : `${process.env.REACT_APP_HOST}/api/tag/delete`;
  // 태그 삭제 유형에 따라 다른 데이터 전송 (그룹 태그 삭제, 피드 태그 삭제)
  const data = clickedGroupTagDel
    ? { tag_name: props.tagName }
    : {
        tag_id: props.tagId,
      };
  // Todo : 태그 삭제 기능
  // const tagDelFunC = () => {
  //   // 서버에 태그 삭제 요청
  //   axios.delete(host_url, {
  //     headers: {
  //       Authorization: `Bearer ${cookies.logCookie}`,
  //     },
  //     data: data,
  //   });
  //   Swal.fire({
  //     icon: "success",
  //     title: "태그 삭제",
  //     text: "태그가 삭제되었습니다.",
  //     showConfirmButton: false,
  //     timer: 500,
  //   });
  //   // 리액트쿼리에 저장된 태그리스트 업데이트

  //   setTestDel(!testDel);
  // };

  // const deleteTag = useMutation(async (tagId) => {
  //   try {
  //     const res = await axios.delete(
  //       `${process.env.REACT_APP_HOST}/api/tag/${tagId}`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${cookies.logCookie}`,
  //         },
  //       }
  //     );
  //     return res.data;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // });

  const delClickHandler = () => {
    if (props.onFunc) {
      // console.log("그룹 태그 삭제");
      props.onFunc(data);
    } else {
      if (props.tagId) {
        // 삭제 태그리스트에 추가
        const delTag = {
          tag_id: props.tagId,
          tag_name: props.tagName,
        };
        setTagsDel([...tagsDel, delTag]);
        setTagList(tagList.filter((tag: any) => tag.tag_id !== props.tagId));
      } else {
        setTagList(
          tagList.filter((tag: any) => tag.tag_name !== props.tagName)
        );
        // 생성 태그리스트에서 삭제
        setTagsCreate(
          tagsCreate.filter((tag: any) => tag.tag_name !== props.tagName)
        );
      }
    }
  };

  return (
    <span className="mt-2 inline-flex items-center mr-2 px-2 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800 hover:bg-sky-300">
      #{props.tagName}
      <button onClick={delClickHandler}>
        <svg
          className="w-4 h-4 ml-1 text-red-400"
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
