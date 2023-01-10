import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  groupFeedListState,
  feedTagListState,
  tagModalVisble,
  tagNameState,
  userInfoState,
  tagFeedList,
} from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";

const AvailableTags = () => {
  const [tagFeedLi, setTagFeedLi] = useRecoilState(tagFeedList);
  const [tagList, setTagList] = useRecoilState(feedTagListState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const tagName = useRecoilValue(tagNameState);
  // const [userData, setUserInfo] = useRecoilState(userInfo); test1 -> 현재 로그인시 유저데이터 받는중
  const userData = useRecoilValue(userInfoState);
  const tagModal = useResetRecoilState(tagModalVisble);
  // const tagModal = useResetRecoilState(tagModalVisble);

  // const gropuId = userData.groupId;
  // // 렌더링된 후 바로 실행
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
      // console.log(data[0].id);
      tagAdd(data.data);
    }
    fetchData();
  }, [userData.groupId]);

  // 피드리스트에 피드아이템 넣기
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
      // recoil feeds state에 피드 추가
      setTagFeedLi((oldTags: any) => [...oldTags, newTag]);
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
      {/* 위에 여백 두고 그룹피드 타이틀 만들기 */}
      {/* 그룹 피드 타이틀 */}
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
