import FeedItem from "./FeedItem/FeedItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { feedState, userInfo } from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";
import {
  DocumentIcon,
  MegaphoneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const AvailableFeeds = () => {
  const [feeds, setFeeds] = useRecoilState(feedState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // const [userData, setUserInfo] = useRecoilState(userInfo); test1 -> 현재 로그인시 유저데이터 받는중
  const userData = useRecoilValue(userInfo);

  // const gropuId = userData.groupId;
  // // 렌더링된 후 바로 실행
  useEffect(() => {
    async function fetchData() {
      const groupId = userData.groupId;
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/feed/group/${groupId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });

      const data = response.data;
      console.log(data);
      // console.log(data[0].id);
      feedadd(data);
    }
    if (userData.groupId) fetchData();
  }, [userData.groupId]);

  // 피드리스트에 피드아이템 넣기
  const feedadd = (data: []) => {
    data.map((item: any) => {
      const newfeed = {
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
      // recoil feeds state에 피드 추가
      setFeeds((oldFeeds: any) => [...oldFeeds, newfeed]);
    });
  };

  const feedsList = feeds.map((feed: any) => (
    <div key={feed.id}>
      <FeedItem
        id={feed.id}
        key={feed.id}
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
      {/* 위에 여백 두고 그룹피드 타이틀 만들기 */}
      {/* 그룹 피드 타이틀 ver1*/}
      {/* <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl antialiased font-bold text-whtie">그룹 피드</h1>
      </div> */}
      {/* 그룹 피드 타이틀 ver2 */}
      <div className="rounded-lg bg-sky-500">
        <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between ">
            <div className="flex items-center flex-1 w-0 ">
              <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <DocumentIcon
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="text-xl font-bold text-white truncate ">
                <span className="md:hidden">그룹 피드</span>
                <span className="hidden md:inline">그룹 피드</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* feedslist section */}
      <div className="">
        <ul className="">{feedsList}</ul>
      </div>
    </div>
  );
};

export default AvailableFeeds;
