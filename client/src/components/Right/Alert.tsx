import {
  BellIcon,
  MegaphoneIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
const Alert = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg justify-self-center basis-1/4">
      <div className="rounded-lg bg-sky-500">
        <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between ">
            <div className="flex items-center flex-1 w-0 ">
              <span className="flex p-2 rounded-lg bg-sky-800">
                <MegaphoneIcon
                  className="w-6 h-6 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="ml-3 font-medium text-white truncate ">
                <span className="md:hidden">알림</span>
                <span className="hidden md:inline">알림</span>
              </p>
            </div>

            <div className="flex-shrink-0 order-2 sm:order-3 sm:ml-3">
              <button
                type="button"
                className="flex p-2 -mr-1 rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="w-6 h-6 text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
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
