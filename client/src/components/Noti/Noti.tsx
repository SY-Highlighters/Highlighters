import { MegaphoneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState, Suspense, lazy } from "react";
import NotiItem from "./NotiItem/NotiItem";
import Calender from "../Calender/Calender";
import { useNoti } from "../../hooks/useNoti";
import { useInView } from "react-intersection-observer";
import NotiList from "./NotiList";
// const NotiList = lazy(() => import("./NotiList"));
export default function Noti() {
  const [notiCount, setNotiCount] = useState(0);

  const clickedAllRead = () => {
    setNotiCount(0);
  };
  return (
    // <div className="w-1/5 xl:fixed right-24 xl:overflow-auto ">
    <div className="hidden pr-14 basis-1/4 xl:block">
      <div className="rounded-md opacity-90 bg-sky-500">
        {/* 메뉴바*/}
        <div className="px-3 py-2 mx-auto rounded-lg max-w-7xl">
          <div className="flex flex-wrap items-center ">
            <div className="flex items-center flex-1 w-0">
              <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <MegaphoneIcon
                  className="w-6 h-6 ml-3 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="text-xl font-bold text-white truncate">
                <span className="">알림</span>
              </p>
              {/* 알림 카운트
              <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 ml-2 text-xs font-medium text-white rounded-full opacity-75 bg-sky-600">
                {notiCount > 99 ? "99+" : notiCount}
              </div> */}

              {/* 모두읽음 구석에 배치 */}
              <span
                onClick={clickedAllRead}
                className="flex items-end justify-end flex-1 w-0 mt-6 ml-2 text-xs text-gray-300 cursor-pointer opacity-70 hover:text-gray-500"
              >
                모두읽음
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* 아래로 긴 카드박스 */}
      <NotiList></NotiList>
      <Calender></Calender>
    </div>
  );
}
