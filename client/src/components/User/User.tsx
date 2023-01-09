import UserInfo from "./UserInfo";
import Group from "../Group/Group";
import GroupTag from "./GroupTag";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { userInfo } from "../../states/atom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
const User = () => {
  // const userdata = useRecoilValue(userInfo);
  const [userData, setUserInfo] = useRecoilState(userInfo);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  useEffect(() => {
    async function userDataGet() {
      const UserResponse = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/user/signin`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      await setUserInfo({
        nickname: UserResponse.data.nickname,
        img: UserResponse.data.image,
        groupName: UserResponse.data.group_name,
        groupId: UserResponse.data.group_id,
      });
    }
    userDataGet();
  }, []);

  // react-query 적용
  // const { data, isLoading, isError } = useQuery("user", async () => {
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
  // if (data) {
  //   console.log("유저 정보 로딩 성공");
  //   console.log(data);
  //   setUserInfo({
  //     nickname: data.nickname,
  //     img: data.image,
  //     groupName: data.group_name,
  //     groupId: data.group_id,
  //   });
  // }

  //Todo: 후에 유저정보가 변경되었을때 useEffect함수가 작동해서 다시 유저정보를 리로드해야함
  return (
    <div className="basis-1/4">
      <aside className="grid grid-col-2">
        <UserInfo></UserInfo>
        <Group></Group>
        <GroupTag></GroupTag>
      </aside>
    </div>
  );
};

export default User;
// function useQuery(
//   arg0: string,
//   arg1: () => Promise<any>
// ): { data: any; isLoading: any; isError: any } {
//   throw new Error("Function not implemented.");
// }
