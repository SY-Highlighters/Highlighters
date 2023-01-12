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
      return response.data.data;
    },
    {}
  );

  return (
    <div>
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
      <div className="">
        <ul className="">
          {isSuccess &&
            feedsBookmark &&
            feedsBookmark.map((feed: any) => (
              <div key={feed.id}>
                <FeedItem
                  id={feed.id}
                  key={feed.id}
                  title={feed.title}
                  description={feed.og.description}
                  og_image={feed.og.image}
                  url={feed.url}
                  highlight={feed.highlight}
                  date={feed.createdAt}
                  tag={feed.tag}
                  writer={feed.user.nickname}
                  writerImg={feed.user.image}
                />
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}
