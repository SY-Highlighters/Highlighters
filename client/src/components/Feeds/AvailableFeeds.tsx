import FeedItem from "./FeedItem/FeedItem";
import { useEffect, useState } from "react";
// import { useRecoilState, useRecoilValue } from "recoil";
// import {
//   groupFeedListState,
//   userInfoState,
//   tagModalVisble,
// } from "../../states/atom";
import { useCookies } from "react-cookie";
// import { useEffect } from "react";
import axios from "axios";
import { DocumentIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
// import { TagEditModal } from "../Tags/TagEditModal";
import { QueryCache, useQuery, QueryClient, useQueryClient } from "react-query";
const AvailableFeeds = () => {
  // const [feeds, setFeeds] = useRecoilState(groupFeedListState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // const [tagModal, setTagModal] = useRecoilState(tagModalVisble);
  // const queryClient = useQueryClient();
  // const user = queryClient.getQueryData("user");
  // const [user, setUser] = useState(null);

  // const [userData, setUserInfo] = useRecoilState(userInfo); test1 -> 현재 로그인시 유저데이터 받는중
  // const userData = useRecoilValue(userInfoState);
  // const gropuId = userData.groupId;
  // react query 캐시에서 유저 데이터 가져옴
  const { data: user } = useQuery("user", async () => {
    const response = await axios({
      method: "get",
      url: `${process.env.REACT_APP_HOST}/api/user/signin`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.logCookie}`,
      },
    });
    return response.data;
  });
  const groupId = user?.group_id;

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
      console.log(response.data.data);
      return response.data.data;
    },
    {
      enabled: groupId !== undefined,
    }
  );
  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await axios({
  //       method: "get",
  //       url: `${process.env.REACT_APP_HOST}/api/feed/group/${user!.group_id}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.logCookie}`,
  //       },
  //     });

  //     const data = response.data;
  //     console.log(data);
  //     // console.log(data[0].id);
  //     feedadd(data);
  //   }
  //   fetchData();
  // }, []);

  // 피드리스트에 피드아이템 넣기
  // const feedadd = (data: []) => {
  //   data.map((item: any) => {
  //     const newfeed = {
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
  //     // recoil feeds state에 피드 추가
  //     setFeeds((oldFeeds: any) => [...oldFeeds, newfeed]);
  //   });
  // };

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
