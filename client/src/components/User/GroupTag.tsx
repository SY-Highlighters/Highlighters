import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { groupTagList } from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";
import { TagItem } from "../Tags/TagItem/TagItem";
const GroupTag = () => {
  const [grouptagList, setGroupTagList] = useRecoilState(groupTagList);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  useEffect(() => {
    async function fetchData() {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/tag/web`,
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
  }, []);

  // 피드리스트에 피드아이템 넣기
  const tagAdd = (data: []) => {
    data.map((item: any) => {
      const newTag = {
        tag_name: item,
      };
      // recoil feeds state에 피드 추가
      setGroupTagList((oldTags: any) => [...oldTags, newTag]);
    });
  };

  const tagsList = grouptagList.map((tag: any) => (
    <span>
      <TagItem content={tag.tag_name} />
    </span>
  ));
  return (
    <div className="w-full mt-10 bg-white rounded-lg shadow-lg">
      <div className="" />
      <div className="relative p-6 rounded-3xl -top-5">
        <div className="relative flex items-end">
          <h3 className="mt-5 text-2xl antialiased font-bold ">﹟태그</h3>
          <div className="flex flex-col items-center px-5"></div>
        </div>
        {/* 태그 공간 -> fix:동적 처리*/}
        <div className="relative items-end mb-3">{tagsList}</div>
      </div>
    </div>
  );
};

export default GroupTag;
