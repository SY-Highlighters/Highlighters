import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import {

  mainSectionState,
  tagsInFeedState,
  tagsCreateState,
  tagsDelState,
} from "../../../atoms/atom";
import { activeTag } from "../../../atoms/tag";
import Swal from "sweetalert2";
export function TagItem(props: any) {
  const setActiveTag = useSetRecoilState(activeTag);
  const setMainSectionNum = useSetRecoilState(mainSectionState);
  // const currentFeedId = useRecoilValue(currentFeedState);
  const [tagList, setTagList] = useRecoilState(tagsInFeedState);
  const [tagsCreate, setTagsCreate] = useRecoilState(tagsCreateState);
  const [tagsDel, setTagsDel] = useRecoilState(tagsDelState);
  const tags =
    props.count && props.count ? (
      <span className="inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800 hover:bg-sky-300 hover:scale-95">
        {`#${props.name} `}{" "}
        <span className="ml-1 font-bold text-sky-500">{` ${props.count}`}</span>
      </span>
    ) : (
      <span className="inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800 hover:bg-sky-300 hover:scale-95">
        #{props.name}
      </span>
    );
  const tagClickHandler = () => {
    // 태그 생성 모드일 때
    if (props.onFunc) {
      tagAddFunC();
    }
    // 태그에 해당하는 피드 보여주기
    else {
      setMainSectionNum(2);
      // console.log("태그아이템 클릭", props.name, props.id);
      setActiveTag({
        tag_name: props.name,
        tag_id: props.tag_id,
      });
    }
  };
  function tagAddFunC() {
    //현재 태그리스트에 있는지 확인
    if (tagList.find((item: any) => item.tag_name === props.name)) {
      Swal.fire({
        icon: "error",
        title: "태그 중복",
        text: "이미 존재하는 태그입니다.",
        showConfirmButton: false,
        timer: 500,
      });
    } else {
      // 1. 삭제된 태그 리스트에 있는지 확인
      const delTag = tagsDel.find((item: any) => item.tag_name === props.name);
      // console.log("delTag입니다.", delTag);
      // 1-1. 있으면 삭제된 태그 리스트에서 삭제하고, 현재 태그 리스트에 추가
      if (delTag) {
        setTagsDel(tagsDel.filter((item: any) => item.tag_name !== props.name));
        setTagList([...tagList, delTag]);
      } else {
        // console.log("여긴옴?");
        // 2. 생성된 태그 리스트에 있는지 확인

        const createTag = tagsCreate.find(
          (item: any) => item.tag_name === props.name
        );
        // console.log("createTag", createTag);
        // 2-1. 없으면 생성된 태그 리스트에 추가
        if (!createTag) {
          const newTagItem = {
            tag_name: props.name,
          };
          setTagList([...tagList, newTagItem]);
          setTagsCreate([...tagsCreate, newTagItem]);
        }
        // 2-2. 있으면 생성된 태그 리스트에서 삭제
        else {
          Swal.fire({
            icon: "error",
            title: "태그 중복",
            text: "이미 존재하는 태그입니다.",
            showConfirmButton: false,
            timer: 500,
          });
        }
      }

      // Swal.fire({
      //   icon: "error",
      //   title: "태그 중복",
      //   text: "이미 존재하는 태그입니다.",
      //   showConfirmButton: false,
      //   timer: 500,
      // });
    }

    // const newTagItem = {
    //   tag_name: props.name,
    // };
    // console.log(newTagItem);
    // 생성 태그 리스트에 추가
    // setTagsCreate([...tagsCreate, newTagItem]);
    // } else {
    //   alert("태그 생성 실패!");
    // }
    // });
  }

  return (
    <button onClick={tagClickHandler} className="mt-2">
      {tags}
    </button>
  );
}
