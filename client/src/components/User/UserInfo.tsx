import { userInfo } from "../../states/atom";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import axios from "axios";
import { useCookies } from "react-cookie";
import { feedState } from "../../states/atom";
const UserInfo = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [userData, setUserInfo] = useRecoilState(userInfo);
  // const setFeeds = useSetRecoilState(feedState);

  // useEffect(() => {
    // async function userData() {
    //   const UserResponse = await axios({
    //     method: "get",
    //     url: `${process.env.REACT_APP_HOST}/api/feed/findusers/me/`,
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${cookies.logCookie}`,
    //     },
    //   });

    //   setUserInfo({
    //     nickname: UserResponse.data.userNickname,
    //     img: UserResponse.data.userImage,
    //     groupName: UserResponse.data.groupName,
    //     groupId: UserResponse.data.groupId,
    //   });

      // const feedsResponse = await axios({
      //   method: "get",
      //   url: `${process.env.REACT_APP_HOST}/api/feed/group/${UserResponse.data.groupId}`,
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${cookies.logCookie}`,
      //   },
      // });
      // const data = feedsResponse.data;
      // feedadd(data);
    
  //   userData();
  // }, []);

  // // 렌더링된 후 바로 실행
  // useEffect(() => {
  //   async function fetchData() {
  //     const response = await axios({
  //       method: "get",
  //       url: `${process.env.REACT_APP_HOST}/api/feed/group/1`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.logCookie}`,
  //       },
  //     });

  //     if (userData.groupId) {
  //       const data = response.data;
  //       feedadd(data);
  //     } else {
  //       console.log("유저 그룹 없음");
  //     }
  //   }
  //   fetchData();
  // }, []);
  // 피드리스트에 피드아이템 넣기
  // const feedadd = (data: []) => {
  //   data.map((item: any) => {
  //     const newfeed = {
  //       id: item.id,
  //       key: item.id,
  //       url: item.url,
  //       og_image: item.og_image,
  //       title: item.og_title,
  //       description: item.og_desc,
  //       highlight: item.highlight,
  //       Date: item.createdAt,
  //     };
  //     // recoil feeds state에 피드 추가
  //     setFeeds((oldFeeds: any) => [...oldFeeds, newfeed]);
  //   });
  // };
  return (
    <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden">
      <div className="h-14" />
      <div className="relative p-6 rounded-3xl -top-5">
        <div className="relative flex items-end px-3 justify-left -top-5">
          <img className="rounded-full w-14 h-14" src={userData.img} alt="" />
          <div className="flex flex-col px-5">
            {/* <span className="font-bold text-left text-sky-500">정글 5기</span> */}
            <span className="font-bold text-left text-sky-500">
              {userData.groupName}
            </span>
            <span className="text-2xl font-medium text-left">
              {userData.nickname}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
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
