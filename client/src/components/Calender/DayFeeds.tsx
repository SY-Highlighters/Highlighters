import {
  CalendarDaysIcon,
  Squares2X2Icon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { FeedsInDay } from "./FeedsInDay";
import { useRecoilValue, useRecoilState } from "recoil";

import {
  selectedDayState,
  changeMainSectionState,
  mainSectionState,
} from "../../atoms/atom";
const DayFeeds = () => {
  const [mainSectionNum, setMainSectionNum] = useRecoilState(mainSectionState);

  const [changeMainSection, setChangeMainSection] = useRecoilState(
    changeMainSectionState
  );
  const clickedMainChange = () => {
    setChangeMainSection(!changeMainSection);
  };
  const selectedDay = useRecoilValue(selectedDayState);
  const date = new Date(selectedDay);
  // 9시간 뺴서 한국 시간으로 변환
  const kDate = date.setHours(date.getHours() - 9);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate() + 1;
  const handleBookmarkClick = () => {
    setMainSectionNum(0);
  };
  console.log("kDate", kDate);
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
            <button
              onClick={handleBookmarkClick}
              className="p-1 text-white bg-sky-500 hover:bg-sky-500 "
            >
              <HomeIcon className="w-6 h-6"></HomeIcon>
            </button>
            <div className="justify-self-end">
              <Squares2X2Icon
                onClick={clickedMainChange}
                className="text-white cursor-pointer w-7 h-7 xl:block top-24 left-20 hover:text-sky-600 hover:scale-95"
              ></Squares2X2Icon>
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
