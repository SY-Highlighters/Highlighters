import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { feedsTagListState } from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { TagItem } from "../Tags/TagItem/TagItem";
import { useQuery } from "react-query";
import { TagEditItem } from "../Tags/TagItem/TagEditItem";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
export function GrouptagList(props: any) {
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
  );
  useEffect(() => {}, []);
  return (
    <div>
      {isSuccess &&
        tagList &&
        tagList.map((tag: any) => (
          <span key={tag.id}>
            <TagItem
              name={tag.tag_name}
              count={tag._count.tag_name}
              id={tag.id}
              onFunc={props.onFunc}
            />
          </span>
        ))}
    </div>
  );
}
