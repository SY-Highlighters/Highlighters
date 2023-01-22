import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { feedsTagListState, testDelState } from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { TagEditItem } from "../Tags/TagItem/TagEditItem";
import { ArchiveBoxXMarkIcon, HashtagIcon } from "@heroicons/react/24/outline";
import { useMutation } from "react-query";

const GroupTagListEdit = (props: any) => {
  const [grouptagList, setGroupTagList] = useRecoilState(feedsTagListState);
  const [cookies] = useCookies(["logCookie"]);
  const [clickedTagEdit, setClickedTagEdit] = useState(false);
  const [testDel, setTestDel] = useRecoilState(testDelState);

  const {
    data: tagEditList,
    isSuccess,
    refetch,
  } = useQuery(
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
        return res.data.data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      staleTime: 0,
      suspense: true,
    }
  );

  const { mutate, data } = useMutation(async (data: any) => {
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_HOST}/api/tag/web/delete`,
        {
          data: {
            tag_name: data.tag_name,
          },

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.logCookie}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
    }
  });

  const deleteTagHandler = async (data: any) => {
    try {
      await mutate(data);
      // data에 해당하는 tagEditItem 삭제
      refetch();
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect(() => {}, [tagEditList]);
  return (
    <div className="">
      {isSuccess && tagEditList.length === 0 && (
        <div className="flex flex-col items-center justify-center opacity-75">
          <div className="flex items-center justify-center w-20 h-20 rounded-full ">
            <HashtagIcon
              className="w-10 h-10 text-sky-400"
              aria-hidden="true"
            />
          </div>
          <p className="text-base font-bold text-gray-500 ">태그가 없습니다.</p>
        </div>
      )}
      {isSuccess &&
        tagEditList &&
        tagEditList.map((tag: any) => (
          <span key={tag.id}>
            <TagEditItem
              key={tag.tag_id}
              tagName={tag.tag_name}
              tagId={tag.tag_id}
              onFunc={deleteTagHandler}
            />
          </span>
        ))}
    </div>
  );
};
export default GroupTagListEdit;
