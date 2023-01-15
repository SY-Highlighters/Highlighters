import { MegaphoneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import NotiItem from "./NotiItem/NotiItem";
import { NotiData } from "../../models/notiData";
import Calender from "../Cal/Calender";
const host_url = `${process.env.REACT_APP_HOST}/api/noti/web`;
export default function Noti() {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [notiData, setNotiData] = useState<NotiData[]>([]);
  const [notiVisible, setNotiVisible] = useState(false);
  useEffect(() => {
    async function notiGet() {
      const res = await axios({
        method: "get",
        url: host_url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      notiAdd(res.data.data);
    }
    notiGet();
  }, []);

  // 피드리스트에 피드아이템 넣기
  const notiAdd = (data: any) => {
    data.map((item: any) => {
      const newNoti = {
        id: item.id,
        contents: item.contents,
        nickname: item.nickname,
        feed_id: item.feed_id,
        title: item.title,
        url: item.url,
      };
      // // NotiList에 NotiItem 추가
      setNotiData((prev) => [...prev, newNoti]);
    });
  };
  const notiList = notiData.map((noti: any) => (
    <div key={noti.id}>
      <NotiItem
        sender={noti.nickname}
        title={noti.title}
        contents={noti.contents}
        url={noti.url}
      />
    </div>
  ));
  return (
    // <div className="w-1/5 xl:fixed right-24 xl:overflow-auto ">
    <div className="hidden pr-16 basis-1/4 xl:block">
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
            </div>
          </div>
        </div>
      </div>
      {/* 아래로 긴 카드박스 */}
      <div className="mt-5 overflow-y-auto bg-white rounded-lg shadow-lg h-1/3">
        <div className="m-5">
          {/* 카드박스 내용 */}
          <ul className="">{notiList}</ul>
          {/* 카드박스 내용 1 */}
        </div>
      </div>
      <Calender></Calender>
    </div>
  );
}
