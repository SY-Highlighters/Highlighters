import { Fragment } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import AvailableFeeds from "../Feeds/AvailableFeeds";
import AvailableTags from "../Tags/AvailableTags";
import { FeedTagEditModal } from "../Tags/FeedTagEditModal";
import { useEffect, useState } from "react";
import {
  mainSectionState,
  userInfoState,
  tagModalVisble,
} from "../../states/atom";
import { AvailableBookmarks } from "../Bookmarks/AvailableBookmarks";
import { useQueryClient } from "react-query";
import Noti from "../Noti/Noti";
import User from "../User/User";
import { useCookies } from "react-cookie";
// import { useEffect } from "react";
import axios from "axios";
import { QueryCache, useQuery, QueryClient } from "react-query";
// import { GroupTagEditModal } from "../Tags/GroupTagEditModal";
export function Main() {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  const mainSectionNum = useRecoilValue(mainSectionState);
  const [tagModal, setTagModal] = useRecoilState(tagModalVisble);
  const {
    data: user,
    isSuccess,
    isLoading,
    error,
  } = useQuery(
    ["user", cookies.logCookie],
    async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/api/user/signin`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.logCookie}`,
            },
          }
        );
        console.log("서버에서 가져옴", user);
        return res.data;
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
      enabled: !!cookies.logCookie,
    }
  );
  const MainSection = (setionNum: number) => {
    switch (setionNum) {
      case 0:
        return <AvailableFeeds></AvailableFeeds>;
      case 1:
        return <AvailableBookmarks></AvailableBookmarks>;
      case 2:
        return <AvailableTags></AvailableTags>;
      default:
        return <AvailableFeeds></AvailableFeeds>;
    }
  };
  // useEffect(() => {
  //   setLocalUser(userData);
  // }, [userData]);
  return (
    <Fragment>
      <div className="gap-4 m-8 mx-10 xl:flex-row xl:flex xl:px-40 ">
        <User></User>
        {isSuccess && user.group_id && MainSection(mainSectionNum)}
        {isSuccess && user.group_id && <Noti></Noti>}
      </div>

      {tagModal === 1 && <FeedTagEditModal></FeedTagEditModal>}
      {/* {tagModal === 2 && <GroupTagEditModal></GroupTagEditModal>} */}
    </Fragment>
  );
}
