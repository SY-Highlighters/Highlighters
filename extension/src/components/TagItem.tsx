import { useSetRecoilState } from "recoil";
import { tagsInFeedState } from "../states/atom";

export function TagItem(props: any) {
  // console.log("여기는 태그아이템");
  // const setFeedTags = useSetRecoilState(tagsInFeedState);

//   const buttonClickHandler = () => {
//     newTag = {
//         <span>
//       <TagItem id={tag.tag_id} name={tag.tag_name}></TagItem>
//         </span>
// }
//     setFeedTags((oldTags: any) => [...oldTags, newTag]);
//   };

  return (
    <button className="mt-1">
      <span className="inline-flex items-center mr-1 px-1.5 py-0.2 rounded-full text-xs font-medium bg-sky-100 text-sky-800 hover:bg-sky-300">
        #{props.name}
      </span>
    </button>
  );
}
