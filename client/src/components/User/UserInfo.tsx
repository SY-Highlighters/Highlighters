import { PaperClipIcon } from "@heroicons/react/20/solid";
// 더미 유저 정보
const user = {
  name: "김성태",
  email: "tom@example.com",
  imageUrl:
    "https://velog.velcdn.com/images/chobae/post/6bfebba6-5f10-4e2f-b8ec-12a9b26d1bb0/image.png",
};
const UserInfo = () => {
  return (
    <div className="justify-self-center">
      <div>
        <div className="h-5"></div>
        {/* 타이틀 */}
        <h2 className="font-bold text-1xl">내 정보</h2>
        {/* 프로필 */}
        <div className="grid grid-cols-2 ">
          <div className="">
            <img
              className="h-12 rounded-full w-13"
              src={user.imageUrl}
              alt=""
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                className="w-12 h-12 rounded-full"
                src={user.imageUrl}
                alt=""
              />
              <span className="absolute right-0 bottom-0 inline-block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-400"></span>
            </div>
            <h1 className="font-bold text-center">{user.name}</h1>
            <h2 className="font-medium text-center text-sky-600">정글 5기</h2>
          </div>

          <div className="">
            <h1 className="font-bold text-right">{user.name}</h1>
            <h2 className="font-medium text-right text-sky-600">정글 5기</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
