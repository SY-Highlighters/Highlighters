import UserInfo from "./UserInfo";
import Group from "../Group/Group";
import GroupTag from "./GroupTag";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { userInfo } from "../../states/atom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
const User = () => {
  // const userdata = useRecoilValue(userInfo);
  const [userData, setUserInfo] = useRecoilState(userInfo);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  useEffect(() => {
    async function userDataGet() {
      console.log("유저 데이터 불러오는중");
      const UserResponse = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/feed/findusers/me/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });

      await setUserInfo({
        nickname: UserResponse.data.userNickname,
        img: UserResponse.data.userImage,
        groupName: UserResponse.data.groupName,
        groupId: UserResponse.data.groupId,
      });
    }
    userDataGet();
  }, []);
  // 후에 유저정보가 변경되었을때 useEffect함수가 작동해서 다시 유저정보를 리로드해야함
  return (
    <div className="basis-1/4">
      <aside className="grid grid-col-2">
        <UserInfo></UserInfo>
        {userData.groupName ? <GroupTag></GroupTag> : <Group></Group>}
        {/* <GroupTag></GroupTag> */}
      </aside>
    </div>
  );
};

export default User;
