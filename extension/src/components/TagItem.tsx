import { useSetRecoilState } from "recoil";
import { tagsInFeedState } from "../states/atom";
import React from "react";
export function TagItem(props: any) {
  const setFeedTags = useSetRecoilState(tagsInFeedState);
  const [disable, setDisabled] = React.useState(false);

  const buttonClickHandler = () => {
    const newTag = props.name

    setFeedTags((oldTags: any) => [...oldTags, newTag]);
    setDisabled(true);
  };

  return (
    <button
      disabled={disable}
      onClick={buttonClickHandler}
      className="mt-1"
    >
      <span
        className={
          disable
            ? "inline-flex items-center mr-1 px-1.5 py-0.2 rounded-full text-xs font-medium bg-sky-300 text-sky-800"
            : "inline-flex items-center mr-1 px-1.5 py-0.2 rounded-full text-xs font-medium bg-sky-100 text-sky-800 hover:bg-sky-300"
        }
      >
        #{props.name}
      </span>
    </button>
  );
}
