import { useRecoilState } from "recoil";
import { tagsInFeedState } from "../states/atom";
import React from "react";
export function TagEditItem(props: any) {
  // console.log("여기는 태그아이템");
  const [feedTags, setFeedTags] = useRecoilState(tagsInFeedState);

  const buttonClickHandler = () => {
    setFeedTags(feedTags.filter((tag: any) => tag.tag_name !== props.name));
  };

  return (
    <span
      onClick={buttonClickHandler}
      className="cursor-pointer inline-flex items-center mr-1 px-1.5 py-0.2 rounded-full text-xs font-medium bg-sky-300 text-sky-800 hover:bg-sky-100"
    >
      #{props.name}
      <svg
        className="w-2 h-2 ml-2 text-black "
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
    </span>
  );
}
