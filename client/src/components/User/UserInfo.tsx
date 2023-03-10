import { useUserData } from "../../hooks/useUserData";

const UserInfo = () => {

  // react-query 사용 시 server state
  const { data: user, isSuccess } = useUserData();

  if (isSuccess) {
    return (
      //QueryClientProvider로 감싸져있어서 queryClient를 사용할 수 있다.
      <div className="w-full bg-white rounded-lg shadow-lg">
        {/* <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden"> */}
        <div className="h-10" />
        <div className="relative p-6 rounded-3xl -top-5">
          <div className="relative flex items-end px-3 justify-left -top-1">
            <img className="rounded-full shadow-lg w-14 h-14" src={user.image} alt="" />
            <div className="flex flex-col px-5">
              <span className="text-sm font-bold text-left text-sky-500">
                {user.group_name ? user.group_name : "그룹 없음"}
              </span>
              <span className="text-xl font-medium text-left">
                {user.nickname}
              </span>
            </div>
          </div>
        </div>
        {/* <div className="h-24 mx-auto mt-20 border-2 rounded-md opacity-50 w-60">
          <div className="flex flex-row items-center justify-center h-full space-x-5 animate-pulse">
            <div className="bg-gray-300 rounded-full w-14 h-14 "></div>
            <div className="flex flex-col space-y-3">
              <div className="w-20 h-4 bg-gray-300 rounded-md "></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md "></div>
            </div>
          </div>
        </div> */}
      </div>
    );
  } else {
    // 로딩 중 또는 에러 발생 시 스켈레톤 UI 보여줌
    return (
      <div className="w-full bg-white rounded-lg shadow-lg animate-pulse">
        <div className="h-10" />
        <div className="relative p-6 rounded-3xl -top-5">
          <div className="relative flex items-end px-3 justify-left -top-1">
            <div className="bg-gray-300 rounded-full w-14 h-14 "></div>

            <div className="flex flex-col ml-2 space-y-2 ">
              <div className="w-20 h-4 bg-gray-300 rounded-md "></div>
              <div className="w-24 h-6 bg-gray-300 rounded-md "></div>
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
