import { useCookies } from "react-cookie";
import { useUserData } from "../../hooks/useUserData";

const UserInfo = () => {
  const [cookies] = useCookies(["logCookie"]);

  // react-query 사용 시 server state
  const { data: user, isSuccess } = useUserData(cookies);

  if (isSuccess) {
    return (
      //QueryClientProvider로 감싸져있어서 queryClient를 사용할 수 있다.
      <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden">
        {/* <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden"> */}
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
