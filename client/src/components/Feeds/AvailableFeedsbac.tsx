import FeedItem from "./FeedItem/FeedItem";

import { useCookies } from "react-cookie";
import axios from "axios";
import { DocumentIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { QueryCache, useQuery, QueryClient, useQueryClient } from "react-query";
import { useUserData } from "../../hooks/useUserData";
import { useEffect } from "react";
const AvailableFeeds = () => {
  const [cookies] = useCookies(["logCookie"]);

  // react query 캐시에서 유저 데이터 가져옴
  const { data: user } = useUserData();

  const groupId = user?.group_id;

  useEffect(() => {
    // console.log("groupId: ", groupId);
  }, [groupId]);
  
  const { data: feedsInGroup, isSuccess } = useQuery(
    "feedsInGroup",
    async () => {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/feed/group/${groupId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      // console.log(response.data.data);
      return response.data.data;
    },
    {
      enabled: groupId !== undefined,
    }
  );

  return (
    <div className="h-12 overscroll-auto basis-2/4">
      {/* 위에 여백 두고 그룹피드 타이틀 만들기 */}
      {/* 그룹 피드 타이틀 ver1*/}
      {/* <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl antialiased font-bold text-whtie">그룹 피드</h1>
      </div> */}
      {/* 그룹 피드 타이틀 ver2 */}
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
                <span className="md:hidden">그룹 피드</span>
                <span className="hidden md:inline">그룹 피드</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* feedslist section */}
      <div className="mt-5">
        <ul className="">
          {isSuccess &&
            feedsInGroup &&
            feedsInGroup.map((feed: any) => (
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
      {/* {tagModal && <TagEditModal></TagEditModal>} */}
      {/* 토글 버튼 느낌으로 댓글 기능 */}
      <div className="fixed bottom-0 right-0 z-10">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          // onClick={() => setTagModal(true)}
        >
          <MegaphoneIcon className="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
          <span>피드 추가</span>
        </button>
      </div>
    </div>
  );
};

export default AvailableFeeds;

function getUserData() {
  return;
}
