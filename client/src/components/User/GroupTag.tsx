import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { feedsTagListState } from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import axios from "axios";
import { TagItem } from "../Tags/TagItem/TagItem";
import { useQuery } from "react-query";
const GroupTag = (props: any) => {
  const [grouptagList, setGroupTagList] = useRecoilState(feedsTagListState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await axios({
  //       method: "get",
  //       url: `${process.env.REACT_APP_HOST}/api/tag/web`,
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

  const {
    data: tagList,
    isSuccess,
    isLoading,
    error,
  } = useQuery(
    ["tagList"],
    async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/api/tag/web`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.logCookie}`,
            },
          }
        );
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      // cacheTime: 60 * 60 * 1000,
      // 1시간동안 캐시를 사용한다.
      cacheTime: 60 * 60 * 1000,
      staleTime: 2 * 60 * 60 * 1000,
      // Refetch the data when the component mounts, including when the page is refreshed
      refetchOnMount: false,
      // Do not refetch the data when the window gains focus
      refetchOnWindowFocus: false,
      // 쿠키가 준비되었을때 쿼리를 실행한다.
    }
  );
  // // 피드리스트에 피드아이템 넣기
  // const tagAdd = (data: []) => {
  //   data.map((item: any) => {
  //     const newTag = {
  //       tag_name: item.tag_name,
  //       tag_id: item.tag_id,
  //     };
  //     // recoil feeds state에 피드 추가
  //     setGroupTagList((oldTags: any) => [...oldTags, newTag]);
  //   });
  // };

  // const tagsList = grouptagList.map((tag: any) => (
  //   <span>
  //     <TagItem name={tag.tag_name} id={tag.tag_id} />
  //   </span>
  // ));
  return (
    <div
      className={
        props.onCss ? props.onCss : "w-full mt-10 bg-white rounded-lg shadow-lg"
      }
    >
      <div className="" />
      <div className="relative p-6 rounded-3xl -top-5">
        <div className="relative flex items-end">
          <h3 className="mt-5 text-xl antialiased font-bold ">그룹 태그</h3>
          <div className="flex flex-col items-center px-5"></div>
        </div>
        {/* 태그 공간 -> fix:동적 처리*/}
        {/* <div className="relative items-end mb-3">{tagsList}</div> */}
        <div className="relative items-end mb-3">
          {isSuccess &&
            tagList &&
            tagList.map((tag: any) => (
              <span key={tag.id}>
                <TagItem
                  name={tag.tag_name}
                  id={tag.id}
                  onFunc={props.onFunc}
                />
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GroupTag;
