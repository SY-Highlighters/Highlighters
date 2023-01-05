import { BellIcon } from "@heroicons/react/24/outline";
const Alert = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg justify-self-center basis-1/4">
      {/* 그룹 피드 타이틀 */}
      <div className="flex mt-3 ml-3">
        {/* 알림 아이콘 */}
        <BellIcon className="w-7 h-7" />
        <span className="px-3 text-2xl antialiased font-bold">알림</span>
      </div>
      {/* 아래로 긴 카드박스 */}
      <div className="flex flex-col m-5 ">
        {/* 카드박스 내용 */}
        {/* 카드박스 내용 1 */}
        <div className="px-4 py-3 border-t-4 rounded-lg rounded-b shadow-md text-sky-900 bg-sky-100 border-sky-500">
          <div className="flex">
            <div className="py-1"></div>
            <div>
              <p className="font-bold">정글 5기 조성배</p>
              <p className="text-sm">
                2022-12-31 12:28 에 정글 5기에 가입하였습니다.
              </p>
            </div>
          </div>
        </div>
        {/* 카드박스 내용 2 */}
        <div className="px-4 py-3 mt-3 border-t-4 rounded-lg rounded-b shadow-md text-sky-900 bg-sky-100 border-sky-500">
          <div className="flex">
            <div className="py-1"></div>
            <div>
              <p className="font-bold">정글 5기 김현진</p>
              <p className="text-sm">"이것 좀 봐봐!"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
