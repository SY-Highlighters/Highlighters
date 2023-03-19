import { MegaphoneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { reloadNotiState, testNoti } from "../../atoms/atom";
import NotiItem from "./NotiItem/NotiItem";
import Calender from "../Calender/Calender";
import { useNoti } from "../../hooks/useNoti";
import { useInView } from "react-intersection-observer";
import NotiSkeleton from "../UI/NotiSkeleton";
import { useRecoilState } from "recoil";
import { useQuery } from "react-query";
import { useCookies } from "react-cookie";
interface NotiInfiniteList {
  board_page: any;
  current_page: number;
  is_Last: boolean;
}

const NotiList = () => {
  const [ref, isView] = useInView();
  const [reloadNoti, setReloadNoti] = useState(reloadNotiState);
  // const [notiData, setNotiData] = useState([]);
  const [testNt, setTestNoti] = useRecoilState(testNoti);
  const [cookies] = useCookies(["logCookie"]);

  // const {
  //   getBoard,
  //   getNextPage,
  //   getBoardIsSuccess,
  //   getNextPageIsPossible,
  //   status,
  // } = useNoti();
  const {
    data: notiList,
    isSuccess,
    isLoading,
  } = useQuery("notiList", getNoti);
  // console.log("여긴 노티", notiList);
  async function getNoti() {
    const res = await axios({
      method: "get",
      url: `${process.env.REACT_APP_HOST}/api/noti/web`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.logCookie}`,
      },
    });
    setTestNoti(res.data.data.data);
    return res.data.data.data;
  }

  if (isLoading) {
    return <NotiSkeleton></NotiSkeleton>;
  }

  const notiListDel = (delNotiId: any) => {
    const newNotiData = testNt.filter((noti: any) => noti.id !== delNotiId);

    setTestNoti(newNotiData);
  };
  return (
    <div className="mt-5 overflow-y-auto bg-white rounded-lg shadow-lg xl:scrollbar-hide h-1/3 box-shadow-bottom-only ">
      <div className="m-5">
        {isSuccess && testNt.length === 0 && (
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
            isSuccess &&
              testNt.map((noti: any) => {
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
              })
          }
        </ul>
      </div>
    </div>
  );
};

export default NotiList;
