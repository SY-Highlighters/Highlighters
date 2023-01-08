import { useEffect, useState } from "react";
import Noti from "./Noti";

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
  // const [message, setMessage] = useState([]);
  // useEffect(() => {
  //   console.log("messagebox 렌더링");
  //   async function getNotiAsync() {
  //     let response = await chrome.runtime.sendMessage({
  //       greeting: "getNoti",
  //     });
  //     const data = response.data;
  //     messageadd(data);
  //   }
  //   getNotiAsync();
  // }, []);

  // console.log(notiData);
  // const messageadd = (data: []) => {
  //   data.map((item: any) => {
  //     const newMessage = {
  //       message: item.
  //     };
  //     // recoil feeds state에 피드 추가
  //     setMessage((oldFeeds: any) => [...oldFeeds, newMessage]);
  //   });
  // };
  const notiList = dummy_noti.map((noti) => (
    <Noti name={noti.name} message={noti.message}></Noti>
  ));
  return (
    <div className="mx-3">
      <ul>{notiList}</ul>
    </div>
  );
}
