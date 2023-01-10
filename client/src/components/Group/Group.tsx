import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
  userInfoState,
} from "../../states/atom";
// import GroupJoined from "./GroupJoined";
import GroupModal from "./Modal/GroupModal";
import GroupNotJoined from "./GroupNotJoined";
import { useCookies } from "react-cookie";
import { useQuery } from "react-query";
import axios from "axios";
const GroupJoined = React.lazy(async () => import("./GroupJoined"));
export default function Group() {
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);
  const userData = useRecoilValue(userInfoState);
  const [localUser, setLocalUser] = useState(userData);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  // useEffect(() => {
  //   setLocalUser(userData);
  // }, [userData]);
  // react-query 사용 시 server state
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
        console.log("서버에서 가져옴");
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

  if (isSuccess) {
    return (
      //QueryClientProvider로 감싸져있어서 queryClient를 사용할 수 있다.
      <div className="flex flex-col justify-end">
        {user.group_id ? (
          <GroupJoined userGroup={user.group_name}></GroupJoined>
        ) : (
          <GroupNotJoined></GroupNotJoined>
        )}
        {groupModal && <GroupModal></GroupModal>}
      </div>
    );
  } else {
    // 로딩 중 또는 에러 발생 시 화면 빈 크기의 div를 반환
    return (
      <div className="w-full mt-10 bg-white rounded-lg shadow-lg erflow-hidden">
        <div className="h-12" />
        <div className="relative p-6 mb-9 rounded-3xl -top-5">
          <div className="relative flex items-end px-3 justify-left -top-1"></div>
        </div>
      </div>
    );
  }

  // return (
  // <div className="flex flex-col justify-end">
  //   {localUser.groupId ? (
  //     <GroupJoined></GroupJoined>
  //   ) : (
  //     <GroupNotJoined></GroupNotJoined>
  //   )}
  //   {groupModal && <GroupModal></GroupModal>}
  // </div>
  // );
}
