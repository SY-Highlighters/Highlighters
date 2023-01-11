import { useSetRecoilState } from "recoil";
import { clickedTagState, mainSectionState } from "../../../states/atom";

export function TagItem(props: any) {
  const setclickedTag = useSetRecoilState(clickedTagState);
  const setMainSectionNum = useSetRecoilState(mainSectionState);

  const tagClickHandler = () => {
    console.log("tag clicked");
    setMainSectionNum(2);
    setclickedTag({
      tag_name: props.name,
      tag_id: props.id,
    });
  };
  return (
    <button onClick={tagClickHandler}>
      <span className="inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800 hover:bg-sky-300">
        #{props.name}
      </span>
    </button>
  );
}
