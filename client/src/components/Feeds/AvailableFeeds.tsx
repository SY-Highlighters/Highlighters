import { PaperClipIcon } from "@heroicons/react/20/solid";
import FeedItem from "./FeedItem/FeedItem";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { feedState } from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";
const AvailableFeeds = () => {
  const [feeds, setFeeds] = useRecoilState(feedState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  // 렌더링된 후 바로 실행
  useEffect(() => {
    async function fetchData() {
      // const response = await fetgch(
      //   `http://localhost:3001/api/feed/group/${fetchda}`
      // );
      // const data = await response.json();
      // console.log(data);
      const response = await axios({
        method: "get",
        url: `http://localhost:3001/api/feed/group/1`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });

      const data = response.data;
      feedadd(data);
    }
    fetchData();
  }, []);

  // 피드리스트에 피드아이템 넣기
  const feedadd = (data: []) => {
    data.map((item: any) => {
      const newfeed = {
        id: item.id,
        url: item.url,
        og_image: item.og_image,
        title: item.og_title,
        description: item.og_desc,
        highlight: item.highlight,
        Date: item.createdAt,
      };
      // recoil feeds state에 피드 추가
      setFeeds((oldFeeds: any) => [...oldFeeds, newfeed]);
    });
  };

  const feedsList = feeds.map((feed: any) => (
    <div>
      <FeedItem
        id={feed.id}
        key={feed.id}
        title={feed.title}
        description={feed.description}
        og_image={feed.og_image}
        url={feed.url}
        text={feed.highlight}
        date={feed.Date}
      />
    </div>
  ));
  return (
    <div className="h-12 overscroll-auto basis-2/4">
      {/* 위에 여백 두고 그룹피드 타이틀 만들기 */}
      {/* 그룹 피드 타이틀 */}
      <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl font-bold text-whtie"> 그룹 피드</h1>
      </div>
      <div className="">
        <ul className="">{feedsList}</ul>
      </div>
    </div>
  );
};

export default AvailableFeeds;
