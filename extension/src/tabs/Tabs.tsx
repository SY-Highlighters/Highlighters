import { useState } from "react";
import CreateFeed from "./CreateFeed";
import SendNoti from "./SendNoti";
import NotiBox from "./NotiBox";
import Settings from "./Settings";

export default function Tabs(props: any) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const feedExist = props.feed;
  const tabsData = [
    {
      label: feedExist ? "알림 보내기" : "피드 생성하기",
      content: feedExist ? <SendNoti></SendNoti> : <CreateFeed></CreateFeed>,
    },
    {
      label: "알림 확인하기",
      content: <NotiBox></NotiBox>,
    },
    {
      label: "사용자 설정",
      content: <Settings></Settings>,
    },
  ];

  return (
    <div>
      <div className="flex space-x-5 border-b ml-3">
        {/* Loop through tab data and render button for each. */}

        <button
          key={0}
          className={`py-3 border-b-4 transition-colors duration-300 ${
            activeTabIndex === 0
              ? "border-sky-300"
              : "border-transparent hover:border-gray-200"
          }`}
          // Change the active tab on click.
          onClick={() => setActiveTabIndex(0)}
        >
          {tabsData[0].label}
        </button>
        <button
          key={1}
          className={`py-3 border-b-4 transition-colors duration-300 ${
            activeTabIndex === 1
              ? "border-sky-300"
              : "border-transparent hover:border-gray-200"
          }`}
          // Change the active tab on click.
          onClick={() => setActiveTabIndex(1)}
        >
          {tabsData[1].label}
        </button>
        <button
          key={1}
          className={`py-3 border-b-4 transition-colors duration-300 ${
            activeTabIndex === 2
              ? "border-sky-300"
              : "border-transparent hover:border-gray-200"
          }`}
          // Change the active tab on click.
          onClick={() => setActiveTabIndex(2)}
        >
          {tabsData[2].label}
        </button>
      </div>
      {/* Show active tab content. */}
      <div>
        <p>{tabsData[activeTabIndex].content}</p>
      </div>
    </div>
  );
}
