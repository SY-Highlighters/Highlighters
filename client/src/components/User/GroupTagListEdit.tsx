import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { feedsTagListState } from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { TagEditItem } from "../Tags/TagItem/TagEditItem";
export function GrouptagListEdit(props: any) {
  const [grouptagList, setGroupTagList] = useRecoilState(feedsTagListState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [clickedTagEdit, setClickedTagEdit] = useState(false);

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
        console.log(res.data.data);
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
  return (
    <div className="relative items-end mb-3">
      {isSuccess &&
        tagList &&
        tagList.map((tag: any) => (
          <span key={tag.id}>
            <TagEditItem
              key={tag.tag_id}
              tagName={tag.tag_name}
              tagId={tag.tag_id}
            />
          </span>
        ))}
    </div>
  );
}
