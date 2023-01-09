import { useEffect, useState } from "react";
import Noti from "./Noti";
import NotiData from "./models/notiData";
let notiData: any[];
const dummy_noti = [
  {
    name: "김현진",
    message: "이거 보라니깐",
  },
  {
    name: "박예린",
    message: "이제 점심 먹을게요",
  },
  {
    name: "김성태",
    message: "이거 먹자",
  },
];
export default function MessageBox() {
  const [notis, setNoti] = useState<NotiData[]>([]);
  useEffect(() => {
    console.log("messagebox 렌더링");
    async function getNotiAsync() {
      let response = await chrome.runtime.sendMessage({
        greeting: "getNoti",
      });
      const data = response.data;
      console.log(data);
      messageadd(data.data);
    }
    getNotiAsync();
  }, []);

  const messageadd = (data: []) => {
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

      // recoil feeds state에 피드 추가
    });
  };

  // {id: 48, contents: '아아아ㅏㄱ', nickname: '일짱예린', feed_id: 40, title: 'SW사관학교 정글 | SW 사관학교 정글 5기를 위한 웹사이트', …}
  const notiList = notis.map((noti) => (
    <Noti
      sender={noti.nickname}
      title={noti.title}
      contents={noti.contents}
    ></Noti>
  ));
  return (
    <div className="mx-3">
      <ul>{notiList}</ul>
    </div>
  );
}
