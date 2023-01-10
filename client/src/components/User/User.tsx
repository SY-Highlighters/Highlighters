import UserInfo from "./UserInfo";
import Group from "../Group/Group";
import GroupTag from "./GroupTag";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { userInfoState } from "../../states/atom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { UserIcon } from "@heroicons/react/24/outline";
const User = () => {
  // const userdata = useRecoilValue(userInfo);
  const [userData, setUserInfo] = useRecoilState(userInfoState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // useEffect(() => {
  //   async function userDataGet() {
  //     const UserResponse = await axios({
  //       method: "get",
  //       url: `${process.env.REACT_APP_HOST}/api/user/signin`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.logCookie}`,
  //       },
  //     });
  //     await setUserInfo({
  //       nickname: UserResponse.data.nickname,
  //       img: UserResponse.data.image,
  //       groupName: UserResponse.data.group_name,
  //       groupId: UserResponse.data.group_id,
  //     });
  //   }
  //   userDataGet();
  // }, []);
  //react-query로 유저정보 받아오기
  // const { data, isSuccess, isLoading, error } = useQuery("user", async () => {
  //   await axios
  //     .get(`${process.env.REACT_APP_HOST}/api/user/signin`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.logCookie}`,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       return res.data;
  //     });
  // });
  // if (isSuccess) {
  //   console.log(data);
  //   setUserInfo({
  //     nickname: data.nickname,
  //     img: data.image,
  //     groupName: data.group_name,
  //     groupId: data.group_id,
  //   });
  // }
  // console.log(data);
  // console.log(isLoading);
  // console.log(error);
  // const [userData, setUserInfo] = useState({
  //   nickname: data.nickname,
  //   img: data.image,
  //   groupName: data.group_name,
  //   groupId: data.group_id,
  // });
  // useEffect(() => {}, [data]);
  // const { data, isSuccess, isLoading, error } = useQuery("user", async () => {
  //   try {
  //     const res = await axios.get(
  //       `${process.env.REACT_APP_HOST}/api/user/signin`,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${cookies.logCookie}`,
  //         },
  //       }
  //     );
  //     console.log(res);
  //     return res.data;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // });

  // if (isSuccess) {
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
        {/* ui ver1  */}
        <div className="mb-5 rounded-lg bg-sky-500">
          <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between ">
              <div className="flex items-center flex-1 w-0 ">
                <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500 ">
                  <UserIcon className="w-6 h-6 text-white" aria-hidden="true" />
                </span>
                <p className="text-xl font-bold text-white truncate ">
                  <span className="md:hidden">정보</span>
                  <span className="hidden md:inline">정보</span>
                </p>
              </div>
            </div>
          </div>
        </div>
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
