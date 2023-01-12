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
import { DocumentIcon, MegaphoneIcon } from "@heroicons/react/24/outline";

export function AvailableBookmarks() {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  const { data: feedsBookmark, isSuccess } = useQuery(
    "feedsBookmark",
    async () => {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/bookmark`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      console.log("이거모냐고", response.data.data[0].feed);
      return response.data.data;
    },
    {}
  );

  return (
    <div className="h-12 overscroll-auto basis-2/4">
      <div className="rounded-lg bg-sky-500">
        <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center flex-1 w-0 ">
              <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <DocumentIcon
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="text-xl font-bold text-white truncate">
                <span className="md:hidden">북마크</span>
                <span className="hidden md:inline">북마크</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <ul className="">
          {isSuccess &&
            feedsBookmark &&
            feedsBookmark.map((item: any) => (
              <div key={item.feed.id} className="mb-4">
                <FeedItem
                  id={item.feed.id}
                  key={item.feed.id}
                  title={item.feed.title}
                  description={item.feed.og.description}
                  og_image={item.feed.og.image}
                  url={item.feed.url}
                  highlight={item.feed.highlight}
                  date={item.feed.createdAt}
                  tag={item.feed.tag}
                  writer={item.feed.user.nickname}
                  writerImg={item.feed.user.image}
                  // commentLen={item.feed.comment.length}
                  // bookmarked={item.feed.bookmark.length > 0 ? true : false}
                />
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}
