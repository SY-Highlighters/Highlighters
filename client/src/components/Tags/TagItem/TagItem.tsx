import { useSetRecoilState } from "recoil";
import { feedViewState, tagState } from "../../../states/atom";

export function TagItem(props: any) {
  const setTagOn = useSetRecoilState(tagState);
  const setView = useSetRecoilState(feedViewState);
  const tagClickHandler = () => {
    console.log("tag clicked");
    setView(!feedViewState);
    setTagOn(props.content);
  };
  return (
    <button onClick={tagClickHandler}>
      <span className="inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800 hover:bg-sky-300">
        #{props.content}
      </span>
    </button>
  );
}
