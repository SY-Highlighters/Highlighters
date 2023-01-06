import { userInfo } from "../../states/atom";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { useCookies } from "react-cookie";

const UserInfo = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [userData, setUserInfo] = useRecoilState(userInfo);

  useEffect(() => {
    async function userData() {
      const response = await axios({
        method: "get",
        url: `http://${process.env.REACT_APP_HOST}/api/feed/findusers/me/`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });

      setUserInfo(response.data);
    }
    userData();
  }, []);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden">
      <div className="h-14" />
      <div className="relative p-6 rounded-3xl -top-5">
        <div className="relative flex items-end px-3 justify-left -top-5">
          <img
            className="rounded-full w-14 h-14"
            src={userData.profile_image}
            alt=""
          />
          <div className="flex flex-col px-5">
            <span className="font-bold text-left text-sky-500">정글 5기</span>
            <span className="text-2xl font-medium text-left">
              {userData.profile_nickname}
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
