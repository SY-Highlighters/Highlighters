import { MegaphoneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import NotiItem from "./NotiItem/NotiItem";
import Calender from "../Calender/Calender";
import { useNoti } from "../../hooks/useNoti";
import { useInView } from "react-intersection-observer";

export default function Noti() {
  const [ref, isView] = useInView();
  // const [noti.dataData, setNotiData] = useState<NotiData[]>([]);
  const { getBoard, getNextPage, getBoardIsSuccess, getNextPageIsPossible } =
    useNoti();
  useEffect(() => {
    // 맨 마지막 요소를 보고있고 페이지가 존재하면
    // 다음 페이지 데이터를 가져옴
    if (isView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [isView, getNextPage, getNextPageIsPossible]);

  console.log(getBoard);
  // const noti.dataAdd = (data: any) => {
  //   data.map((item: any) => {
  //     const newNoti = {
  //       id: item.id,
  //       contents: item.contents,
  //       nickname: item.nickname,
  //       feed_id: item.feed_id,
  //       title: item.title,
  //       url: item.url,
  //     };
  //     // // NotiList에 NotiItem 추가
  //     setNotiData((prev) => [...prev, newNoti]);
  //   });
  // };
  // const noti.dataList = noti.dataData.map((noti.data: any) => (
  //   <div key={noti.id}>
  //     <NotiItem
  //       sender={noti.nickname}
  //       title={noti.title}
  //       contents={noti.contents}
  //       url={noti.url}
  //     />
  //   </div>
  // ));
  // console.log(getBoard === undefined ? "undefined" : getBoard.pages[0]);
  return (
    // <div className="w-1/5 xl:fixed right-24 xl:overflow-auto ">
    <div className="hidden pr-20 basis-1/4 xl:block">
      <div className="rounded-lg bg-sky-500">
        {/* 메뉴바*/}
        <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl">
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
              {/* 모두읽음 오른쪽 구석에 작게 */}
              <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 ml-2 text-xs font-medium text-white rounded-full opacity-75 bg-sky-600">
                {getBoardIsSuccess &&
                  getBoard!.pages[0].board_page.data.totalcount}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 아래로 긴 카드박스 */}
      <div className="mt-5 overflow-y-auto bg-white rounded-lg shadow-lg xl:scrollbar-hide h-1/3 box-shadow-bottom-only ">
        <div className="m-5">
          {getBoardIsSuccess &&
            getBoard!.pages[0].board_page.data.data.length === 0 && (
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-20 h-20 mb-3 rounded-full "></div>
                <p className="text-base font-bold text-gray-500 opacity-50 ">
                  알림이 없습니다.
                </p>
              </div>
            )}
          {/* 카드박스 내용 */}
          <ul className="">
            {
              // 데이터를 불러오는데 성공하고 데이터가 0개가 아닐 때 렌더링
              getBoardIsSuccess && getBoard!.pages
                ? getBoard!.pages.map((page_data, page_num) => {
                    const board_page = page_data.board_page;
                    return board_page.data.data.map((noti: any, idx: any) => {
                      if (
                        // 마지막 요소에 ref 달아주기
                        getBoard!.pages.length - 1 === page_num &&
                        board_page.data.data.length - 1 === idx
                      ) {
                        return (
                          // 마지막 요소에 ref 넣기 위해 div로 감싸기
                          <div ref={ref} key={noti.id} className="">
                            <NotiItem
                              sender={noti.nickname}
                              title={noti.title}
                              contents={noti.contents}
                              url={noti.url}
                            />
                          </div>
                        );
                      } else {
                        return (
                          <div key={noti.id} className="">
                            <NotiItem
                              sender={noti.nickname}
                              title={noti.title}
                              contents={noti.contents}
                              url={noti.url}
                            />
                          </div>
                        );
                      }
                    });
                  })
                : null
            }
          </ul>
        </div>
      </div>
      <Calender></Calender>
    </div>
  );
}
