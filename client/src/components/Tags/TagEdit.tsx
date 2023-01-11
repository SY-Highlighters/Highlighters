import { HashtagIcon } from "@heroicons/react/24/outline";
import { useSetRecoilState } from "recoil";
import {
  tagsInFeedState,
  tagModalVisble,
  currentFeedIdState,
} from "../../states/atom";

export function TagEdit(props: any) {
  const setTagList = useSetRecoilState(tagsInFeedState);
  const setTagModal = useSetRecoilState(tagModalVisble);
  const setCurrentFeedId = useSetRecoilState(currentFeedIdState);
  const tagEditHandler = () => {
    console.log("tagEditHandler");
    console.log(props.tag);
    tagAdd(props.tag);
    setCurrentFeedId(props.feed_id);
    setTagModal(true);
  };

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
    <div>
      <button
        onClick={tagEditHandler}
        className="flex items-center -ml-4 text-sm text-gray-500 hover:text-gray-700"
      >
        <HashtagIcon
          className="flex-shrink-0 w-4 h-4 text-gray-400 "
          aria-hidden="true"
        />
        <span className="ml-1 mr-1">태그 편집</span>
      </button>
    </div>
  );
}
