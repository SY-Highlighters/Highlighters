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
  const [cookies] = useCookies(["logCookie"]);
  const [clickedTagEdit, setClickedTagEdit] = useState(false);

  const { data: tagEditList, isSuccess } = useQuery(
    ["tagEditList"],
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
    }
  );
  return (
    <div>
      {isSuccess &&
        tagEditList &&
        tagEditList.map((tag: any) => (
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
