import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  feedsInGroupState,
  tagsInFeedState,
  clickedTagState,
  userInfoState,
  feedsTagListState,
} from "../../states/atom";
import { useCookies } from "react-cookie";
// import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
const AvailableTags = () => {
  // const [tagFeedList, setTagFeedList] = useRecoilState(feedsTagListState);
  // const [feedsTagList, setFeedsTagList] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const clickedTag = useRecoilValue(clickedTagState);
  console.log("여기는 태그에 대한 피드야", clickedTag);
  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await axios({
  //       method: "get",
  //       url: `${process.env.REACT_APP_HOST}/api/tag/search/${clickedTag.tag_id}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.logCookie}`,
  //       },
  //     });

  //     const data = response.data;
  //     console.log(data);
  //     tagAdd(data.data);
  //   }
  //   fetchData();
  // }, []);

  const { data: feedsInTag, isSuccess } = useQuery(
    "feedsInTag",
    async () => {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/tag/search/${clickedTag.tag_name}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      return response.data;
    },
    {
      enabled: clickedTag.tag_name !== undefined,
    }
  );
  // const tagAdd = (data: []) => {
  //   data.map((item: any) => {
  //     const newTag = {
  //       id: item.id,
  //       key: item.id,
  //       url: item.url,
  //       og_image: item.og_image,
  //       title: item.og_title,
  //       description: item.og_desc,
  //       highlight: item.highlight,
  //       Date: item.createdAt,
  //       tag: item.tag,
  //     };
  //     setFeedsTagList((oldTags: any) => [...oldTags, newTag]);
  //   });
  // };

  // const tagsList = feedsTagList.map((feed: any, index: number) => (
  //   <div key={feed.id}>
  //     <FeedItem
  //       id={feed.id}
  //       key={feed.id + index}
  //       title={feed.title}
  //       description={feed.description}
  //       og_image={feed.og_image}
  //       url={feed.url}
  //       highlight={feed.highlight}
  //       date={feed.Date}
  //       tag={feed.tag}
  //     />
  //   </div>
  // ));
  return (
    <div className="h-12 overscroll-auto basis-2/4">
      <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl antialiased font-bold text-whtie">
          <span className="inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-xl font-bold bg-sky-100 text-sky-800">
            # {clickedTag.tag_name}
          </span>
        </h1>
      </div>
      <div className="">
        <ul className="">
          {isSuccess &&
            feedsInTag &&
            feedsInTag.map((feed: any) => (
              <div key={feed.id}>
                <FeedItem
                  id={feed.id}
                  key={feed.id}
                  title={feed.title}
                  description={feed.og_desc}
                  og_image={feed.og_image}
                  url={feed.url}
                  highlight={feed.highlight}
                  date={feed.createdAt}
                  tag={feed.tag}
                />
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AvailableTags;
