import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue } from "recoil";
import { feedsTagListState, clickedGroupTagDelState } from "../../states/atom";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import { TagItem } from "../Tags/TagItem/TagItem";
import { useQuery } from "react-query";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import { GrouptagList } from "./GroupTagList";
import { GrouptagListEdit } from "./GroupTagListEdit";
const GroupTag = (props: any) => {
  const [grouptagList, setGroupTagList] = useRecoilState(feedsTagListState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [clickedGroupTagDel, setclickedGroupTagDel] = useRecoilState(
    clickedGroupTagDelState
  );

  // 그룹 태그 삭제 버튼 클릭 핸들러
  function groupTagDeleteHandler() {
    console.log("그룹 태그 삭제 버튼 클릭");
    setclickedGroupTagDel(!clickedGroupTagDel);
  }
  return (
    <div
      className={
        props.onCss ? props.onCss : "mt-3 bg-white rounded-lg shadow-lg h-full"
      }
    >
      <div className="m-5">
        {/* <div className="p-6 h-1/3 rounded-3xl"> */}
        <div className="flex items-end">
          <h3 className="text-xl antialiased font-bold ">그룹 태그</h3>
          <ArchiveBoxXMarkIcon
            onClick={groupTagDeleteHandler}
            className="w-5 h-5 mb-1 ml-3 text-red-400 cursor-pointer hover:text-red-600 hover:scale-95"
          ></ArchiveBoxXMarkIcon>
        </div>
      </div>

      <div className="px-2 m-2 overflow-y-auto h-2/3">
        <ul>
          {clickedGroupTagDel ? (
            <GrouptagListEdit></GrouptagListEdit>
          ) : (
            <GrouptagList onFunc={props.onFunc}></GrouptagList>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupTag;
