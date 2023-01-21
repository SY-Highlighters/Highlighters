import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { FeedsInDay } from "./FeedsInDay";
import { useRecoilValue } from "recoil";

import { selectedDayState } from "../../states/atom";
const DayFeeds = () => {
  const selectedDay = useRecoilValue(selectedDayState);
  const date = new Date(selectedDay);
  // 9시간 뺴서 한국 시간으로 변환
  const kDate = date.setHours(date.getHours() - 9);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate() + 1;

  return (
    <div className="basis-2/4">
      <div className="rounded-md opacity-90 bg-sky-500">
        {/* 메뉴바*/}
        <div className="px-3 py-2 mx-auto rounded-lg max-w-7xl ">
          <div className="flex flex-wrap items-center ">
            <div className="flex items-center flex-1 w-0 ">
              <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <CalendarDaysIcon
                  className="w-6 h-6 ml-3 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="text-xl font-bold text-white truncate">
                <span className="">{`${year}년 ${month}월 ${day}일`}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <Suspense fallback={<FeedSkeleton/>}> */}
      <FeedsInDay date={kDate}></FeedsInDay>
      {/* </Suspense> */}
    </div>
  );
};

export default DayFeeds;
