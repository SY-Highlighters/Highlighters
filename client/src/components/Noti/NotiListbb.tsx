import { MegaphoneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { reloadNotiState } from "../../atoms/atom";
import NotiItem from "./NotiItem/NotiItem";
import Calender from "../Calender/Calender";
import { useNoti } from "../../hooks/useNoti";
import { useInView } from "react-intersection-observer";
import NotiSkeleton from "../UI/NotiSkeleton";

interface NotiInfiniteList {
  board_page: any;
  current_page: number;
  is_Last: boolean;
}

const NotiList = () => {
  const [ref, isView] = useInView();
  const [reloadNoti, setReloadNoti] = useState(reloadNotiState);
  const [notiData, setNotiData] = useState([]);
  const {
    getBoard,
    getNextPage,
    getBoardIsSuccess,
    getNextPageIsPossible,
    status,
  } = useNoti();
  // console.log("노티 명단", getBoard);
  useEffect(() => {
    // setNotiData(getBoardIsSuccess && getBoard!.pages[0].board_page.data.data);
    // 맨 마지막 요소를 보고있고 페이지가 존재하면
    // 다음 페이지 데이터를 가져옴
    if (isView && getNextPageIsPossible) {
      getNextPage();
      // setNotiData(getBoard);
    }
  }, [isView, getNextPage, getNextPageIsPossible]);
  // console.log(getBoard);
  // 노티 모두 읽음
  if (status === "loading") {
    return <NotiSkeleton></NotiSkeleton>;
  }
  const notiListDel = (delNotiId: any) => {
    // const newNotiData = notiData.filter((noti: any) => noti.id === delNotiId);
    // setNotiData(newNotiData);
  };
  return (
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
                            delFunc={notiListDel}
                            notiId={noti.id}
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
                            delFunc={notiListDel}
                            notiId={noti.id}
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
  );
};

export default NotiList;
