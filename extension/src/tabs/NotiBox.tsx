/* global chrome */
import { useEffect, useState } from "react";
import Noti from "../components/Noti";
import NotiData from "../models/notiData";

export default function NotiBox() {
  const [notis, setNoti] = useState<NotiData[]>([]);
  useEffect(() => {
    console.log("messagebox 렌더링");
    async function getNotiAsync() {
      let response = await chrome.runtime.sendMessage({
        greeting: "getNoti",
      });
      const data = response.data;
      console.log(data);
      notiAdd(data.data);
    }
    getNotiAsync();
  }, []);

  const notiAdd = (data: []) => {
    data.map((item: any) => {
      const newNoti = {
        id: item.id,
        contents: item.contents,
        nickname: item.nickname,
        feed_id: item.feed_id,
        title: item.title,
        url: item.url,
      };
      setNoti((oldNotis: any) => [...oldNotis, newNoti]);
    });
  };

  const notiList = notis.map((noti) => (
    <Noti
      id={noti.id}
      contents={noti.contents}
      sender={noti.nickname}
      feed-id={noti.feed_id}
      title={noti.title}
      url={noti.url}
    ></Noti>
  ));
  return (
    <div className="mx-3">
      <ul>{notiList}</ul>
    </div>
  );
}
