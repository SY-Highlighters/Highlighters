import {
  DocumentIcon,
  StarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import TagsInFeeds from "./TagsInFeeds";
import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  feedsInGroupState,
  tagsInFeedState,
  clickedTagState,
  userInfoState,
  feedsTagListState,
} from "../../states/atom";

const TagFeeds = () => {
  const clickedTag = useRecoilValue(clickedTagState);

  return (
    <div className="basis-2/4">
      <div className="rounded-md opacity-90 bg-sky-500">
        {/* 메뉴바*/}
        <div className="relative p-3 rounded-3xl">
          <h1 className="text-2xl antialiased font-bold text-whtie">
            <span className="inline-flex shadow-lg items-center mr-2 px-3 py-0.5 rounded-full text-xl font-bold bg-sky-100 text-sky-800">
              # {clickedTag.tag_name}
            </span>
          </h1>
        </div>
      </div>
      <TagsInFeeds></TagsInFeeds>
    </div>
  );
};

export default TagFeeds;
