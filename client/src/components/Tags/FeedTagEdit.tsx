import { HashtagIcon } from "@heroicons/react/24/outline";
import { useSetRecoilState } from "recoil";
import {
  tagsInFeedState,
  tagModalVisble,
  currentFeedState,
} from "../../atoms/atom";

export function FeedTagEdit(props: any) {
  const setTagList = useSetRecoilState(tagsInFeedState);
  const setTagModal = useSetRecoilState(tagModalVisble);
  const setCurrentFeed = useSetRecoilState(currentFeedState);
  const tagEditHandler = () => {
    // console.log("tagEditHandler");
    // console.log(props.tag);

    tagAdd(props.tag);
    // 해당 피드의 id를 전역으로 저장
    setCurrentFeed({
      feed_id: props.feed_id,
      feed_title: props.feedTitle,
    });
    setTagModal(1);
  };
  // 해당 피드에 대한 태그 리스트를 전역으로 저장
  const tagAdd = (data: []) => {
    data.map((item: any) => {
      const newTag = {
        tag_name: item.tag_name,
        feed_id: props.feed_id,
        tag_id: item.id,
      };
      setTagList((oldTags: any) => [...oldTags, newTag]);
    });
  };

  return (
    <div className="">
      <button
        onClick={tagEditHandler}
        className="flex items-center -ml-4 text-sm text-gray-500 hover:text-gray-700"
      >
        <HashtagIcon
          className="flex-shrink-0 w-4 h-4 text-gray-400 "
          aria-hidden="true"
        />
        <span className="ml-1 mr-1">태그 수정</span>
      </button>
    </div>
  );
}
