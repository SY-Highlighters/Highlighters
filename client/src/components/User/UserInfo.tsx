import { userInfoState } from "../../states/atom";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { useCookies } from "react-cookie";
import { groupFeedListState } from "../../states/atom";
import { useQueryClient } from "react-query";
import { useQuery } from "react-query";

const UserInfo = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // const setFeeds = useSetRecoilState(feedState);
  // const [userData, setUserInfo] = useRecoilState(userInfo);
  // 유저정보의 변화가 있을때만 리렌더링
  // const user = useRecoilValue(userInfoState);
  // const queryClient = useQueryClient();
  // const user = queryClient.getQueryData("user");
  // const [user, setUserInfo] = useRecoilState(userInfo);
  // react-query에 저장된 유저정보 받아오기
  // const setUserData = useSetRecoilState(userInfo);
  // console.log(userData);
  // const [userData, setUserInfo] = useRecoilState(userInfo);

  // react-query 사용 시 server state
  const {
    data: user,
    isSuccess,
    isLoading,
    error,
  } = useQuery(
    ["user"],
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
    }
  );

  if (isSuccess) {
    return (
      //QueryClientProvider로 감싸져있어서 queryClient를 사용할 수 있다.
      <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden">
        <div className="h-10" />
        <div className="relative p-6 rounded-3xl -top-5">
          <div className="relative flex items-end px-3 justify-left -top-1">
            <img className="rounded-full w-14 h-14" src={user.image} alt="" />
            <div className="flex flex-col px-5">
              <span className="font-bold text-left text-sky-500">
                {user.group_name ? user.group_name : "그룹 없음"}
              </span>
              <span className="text-2xl font-medium text-left">
                {user.nickname}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // 로딩 중 또는 에러 발생 시 화면 빈 크기의 div를 반환
    return (
      <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden">
        <div className="h-10" />
        <div className="relative p-6 rounded-3xl -top-5">
          <div className="relative flex items-end px-3 justify-left -top-1">
            <img
              className="rounded-full w-14 h-14"
              src={"https://via.placeholder.com/150"}
              alt=""
            />
            <div className="flex flex-col px-5">
              <span className="font-bold text-left text-sky-500"> </span>
              <span className="text-2xl font-medium text-left"> </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // return (
  //   //QueryClientProvider로 감싸져있어서 queryClient를 사용할 수 있다.
  //   <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden">
  //     <div className="h-10" />
  //     <div className="relative p-6 rounded-3xl -top-5">
  //       <div className="relative flex items-end px-3 justify-left -top-1">
  //         <img className="rounded-full w-14 h-14" src={user.image} alt="" />
  //         <div className="flex flex-col px-5">
  //           <span className="font-bold text-left text-sky-500">
  //             {user.groupName ? user.groupName : "그룹 없음"}
  //           </span>
  //           <span className="text-2xl font-medium text-left">
  //             {user.nickname}
  //           </span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default UserInfo;

// {
//   /* 유저 정보 알림 기능 버젼 */
// }
// <div className="flex flex-col items-center">
//   <div className="relative">
//     <img
//       className="w-12 h-12 rounded-full"
//       src={user.imageUrl}
//       alt=""
//     />
//     <span className="absolute right-0 bottom-0 inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-400"></span>
//   </div>
//   <h1 className="font-bold text-center">{user.name}</h1>
//   <h2 className="font-medium text-center text-sky-600">정글 5기</h2>
// </div>;
