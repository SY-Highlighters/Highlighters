import { PaperClipIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
// 더미 유저 정보
const user = {
  name: "김성태",
  email: "@example.com",
  group_name: "정글 5기",
  imageUrl:
    "https://velog.velcdn.com/images/chobae/post/9ef630b0-c0f3-462d-a432-0bbc5a8a6e5f/image.png",
};
const UserInfo = () => {
  return (
    // <div className="grid grid-cols-1">
    //   <div>
    //     <div className="h-12"></div>
    //   </div>
    <div className="w-full bg-white rounded-lg shadow-lg erflow-hidden">
      <div className="h-14" />
      <div className="relative p-6 rounded-3xl -top-5">
        <div className="relative flex items-end px-3 justify-left -top-5">
          <img className="rounded-full w-14 h-14" src={user.imageUrl} alt="" />
          <div className="flex flex-col px-5">
            <span className="font-bold text-left text-sky-500">정글 5기</span>
            <span className="text-2xl font-medium text-left">김성태</span>
          </div>
        </div>
      </div>
    </div>
    // </div>
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

<div className="grid grid-cols-1">
  <div>
    <div className="h-12"></div>
  </div>

  <div className="grid h-5 grid-cols-3">
    {/* 내정보 밑에 공간 */}
    {/* 프로필 */}
    {/* 타이틀 */}
    <div className="col-span-1"></div>
    <div className="col-spam-2">
      <h2 className="font-bold text-1xl">내 정보</h2>
    </div>
  </div>

  {/* 유저 정보
          <div className="">
            <h1 className="font-bold">{user.name}</h1>
            <h2 className="font-medium text-sky-600">{user.group_name}</h2>
          </div> */}
</div>;
