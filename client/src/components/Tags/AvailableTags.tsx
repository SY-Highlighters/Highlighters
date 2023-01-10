import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  feedsInGroupState,
  tagsInFeedState,
  tagNameState,
  userInfoState,
  feedsTagListState,
} from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";

const AvailableTags = () => {
  const [tagFeedList, setTagFeedList] = useRecoilState(tagFeedListState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const tagName = useRecoilValue(tagNameState);
  const userData = useRecoilValue(userInfoState);

  useEffect(() => {
    async function fetchData() {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/tag/search/${tagName}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });

      const data = response.data;
      console.log(data);
      tagAdd(data.data);
    }
    fetchData();
  }, [userData.groupId]);

  const tagAdd = (data: []) => {
    data.map((item: any) => {
      const newTag = {
        id: item.id,
        key: item.id,
        url: item.url,
        og_image: item.og_image,
        title: item.og_title,
        description: item.og_desc,
        highlight: item.highlight,
        Date: item.createdAt,
        tag: item.tag,
      };
      setTagFeedList((oldTags: any) => [...oldTags, newTag]);
    });
  };

  const tagsList = tagFeedLi.map((feed: any, index: number) => (
    <div key={feed.id}>
      <FeedItem
        id={feed.id}
        key={feed.id + index}
        title={feed.title}
        description={feed.description}
        og_image={feed.og_image}
        url={feed.url}
        highlight={feed.highlight}
        date={feed.Date}
        tag={feed.tag}
      />
    </div>
  ));
  return (
    <div className="h-12 overscroll-auto basis-2/4">
      <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl antialiased font-bold text-whtie">
          <span className="inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-xl font-bold bg-sky-100 text-sky-800">
            # {tagName}
          </span>
        </h1>
      </div>
      <div className="">
        <ul className="">{tagsList}</ul>
      </div>
    </div>
  );
};

export default AvailableTags;
