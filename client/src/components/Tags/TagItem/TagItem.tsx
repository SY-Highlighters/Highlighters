import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import {
  clickedTagState,
  mainSectionState,
  currentFeedIdState,
  tagsInFeedState,
} from "../../../states/atom";
import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
export function TagItem(props: any) {
  const setclickedTag = useSetRecoilState(clickedTagState);
  const setMainSectionNum = useSetRecoilState(mainSectionState);
  const currentFeedId = useRecoilValue(currentFeedIdState);
  const [tagList, setTagList] = useRecoilState(tagsInFeedState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
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
    // console.log("tag clicked");
    if (props.onFunc) {
      // console.log("설마여기?");
      tagAddFunC();
    } else {
      setMainSectionNum(2);
      // console.log("태그아이템 클릭", props.name, props.id);
      setclickedTag({
        tag_name: props.name,
        tag_id: props.tag_id,
      });
    }
  };
  async function tagAddFunC() {
    // 태그 중복 체크
    for (let i = 0; i < tagList.length; i++) {
      if (tagList[i].tag_name === props.name) {
        Swal.fire({
          icon: "error",
          title: "태그 중복",
          text: "이미 존재하는 태그입니다.",
        });
        return;
      }
    }
    // const host_url = `${process.env.REACT_APP_HOST}/api/tag/create`;
    // console.log("태그 추가 함수 실행", props.name, currentFeedId);
    // await axios
    //   .post(
    //     host_url,
    //     {
    //       tag_name: props.name,
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
    // console.log(response);
    const newTagItem = {
      tag_name: props.name,
      // tag_id: response.data.id,
    };
    setTagList([...tagList, newTagItem]);
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
