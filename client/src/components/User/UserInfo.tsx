import { userInfo } from "../../states/atom";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { useCookies } from "react-cookie";
import { feedState } from "../../states/atom";
import { useQueryClient } from "react-query";
import { useQuery } from "react-query";

const UserInfo = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // const setFeeds = useSetRecoilState(feedState);
  // const [userData, setUserInfo] = useRecoilState(userInfo);
  // 유저정보의 변화가 있을때만 리렌더링
  // const userData = useRecoilValue(userInfo);
  const queryClient = useQueryClient();
  // const userData = queryClient.getQueryData("user");
  const [user, setUserInfo] = useRecoilState(userInfo);

  // console.log(userData);
  // const [userData, setUserInfo] = useRecoilState(userInfo);
  // const {
  //   data: user,
  //   isLoading,
  //   isError,
  // } = useQuery("user", async () => {
  //   const response = await axios({
  //     method: "get",
  //     url: `${process.env.REACT_APP_HOST}/api/user/signin`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${cookies.logCookie}`,
  //     },
  //   });
  //   return response.data;
  // });
  // if (isLoading) {
  //   console.log("유저 정보 로딩중");
  // }
  // if (isError) {
  //   console.log("유저 정보 로딩 실패");
  // }
  // if (user) {
  //   console.log("유저 정보 로딩 성공");
  //   console.log(user);
  //   setUserInfo({
  //     nickname: user.nickname,
  //     img: user.image,
  //     groupName: user.group_name,
  //     groupId: user.group_id,
  //   });
  // }
  return (
    <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden">
      <div className="h-10" />
      <div className="relative p-6 rounded-3xl -top-5">
        <div className="relative flex items-end px-3 justify-left -top-1">
          <img className="rounded-full w-14 h-14" src={user.img} alt="" />
          <div className="flex flex-col px-5">
            {/* <span className="font-bold text-left text-sky-500">정글 5기</span> */}
            <span className="font-bold text-left text-sky-500">
              {user.groupName ? user.groupName : "그룹 없음"}
            </span>
            <span className="text-2xl font-medium text-left">
              {user.nickname}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
// nickname: data.nickname,
// img: data.image,
// groupName: data.group_name,
// groupId: data.group_id,
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
