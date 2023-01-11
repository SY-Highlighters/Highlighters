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

  const tagClickHandler = () => {
    console.log("tag clicked");
    if (props.onFunc) {
      tagAddFunC();
    } else {
      setMainSectionNum(2);
      setclickedTag({
        tag_name: props.name,
        tag_id: props.id,
      });
    }
  };
  async function tagAddFunC() {
    const host_url = `${process.env.REACT_APP_HOST}/api/tag/create`;

    await axios
      .post(
        host_url,
        {
          tag_name: props.name,
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
          console.log(response);
          const newTagItem = {
            tag_name: props.name,
            tag_id: response.data.id,
          };
          setTagList([...tagList, newTagItem]);
        } else {
          alert("태그 생성 실패!");
        }
      });
  }

  return (
    <button onClick={tagClickHandler} className="mt-2">
      <span className="inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800 hover:bg-sky-300">
        #{props.name}
      </span>
    </button>
  );
}
