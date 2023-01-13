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
import { DocumentIcon, MegaphoneIcon, StarIcon } from "@heroicons/react/24/outline";
import FeedItem from "../Feeds/FeedItem/FeedItem";

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
    <div className="h-12 overscroll-auto basis-2/4">
      <div className="rounded-lg bg-sky-500">
        <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap ustify-between s-center">
            <div className="flex w-0 lex-1 s-center ">
              <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <StarIcon
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                />
                <p className="ml-3 text-xl font-bold text-white truncate">
                  <span className="">북마크</span>
                </p>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <ul className="">
          {isSuccess &&
            feedsBookmark &&
            feedsBookmark.map((feed: any) => (
              <div key={feed.id} className="mb-4">
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
                  commentLen={feed.comment.length}
                  bookmarked={feed.bookmark.length !== 0 ? true : false}
                  bookmarkId={feed.bookmark[0]}
                />
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
}
