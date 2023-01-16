import { useRecoilState } from "recoil";
import { tagsInFeedState } from "../states/atom";
import React from "react";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: false,
  timer: 300,
  // timerProgressBar: true,
  // didOpen: (toast) => {
  //   toast.addEventListener("mouseenter", Swal.stopTimer);
  //   toast.addEventListener("mouseleave", Swal.resumeTimer);
  // },
});
export function TagItem(props: any) {
  const [feedTags, setFeedTags] = useRecoilState(tagsInFeedState);
  // const [disable, setDisabled] = React.useState(false);

  const buttonClickHandler = () => {
    const newTag = props.name;

    for (let i = 0; i < feedTags.length; i++) {
      if (feedTags[i] === newTag) {
        Toast.fire({
          icon: "error",
          title: "이미 추가된 태그입니다.",
        });
        return;
      }
    }

    setFeedTags((oldTags: any) => [...oldTags, newTag]);
    // setDisabled(true);
  };

  return (
    <button onClick={buttonClickHandler} className="mt-1">
      <span
        className={
          // disable
          // ? "inline-flex items-center mr-1 px-1.5 py-0.2 rounded-full text-xs font-medium bg-sky-300 text-sky-800"
          "inline-flex items-center mr-1 px-1.5 py-0.2 rounded-full text-xs font-medium bg-sky-100 text-sky-800 hover:bg-sky-300"
        }
      >
        #{props.name}
      </span>
    </button>
  );
}
