import { useEffect, useState } from "react";
import CreateFeed from "./CreateFeed";
import SendNoti from "./SendNoti";
import NotiBox from "./NotiBox";

export default function Tabs() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [feedExist, setFeedExist] = useState(false);

  useEffect(() => {
    async function getFeed() {
      let response = await chrome.runtime.sendMessage({
        greeting: "getFeed",
      });
      const data = response;
      console.log(data);
      setFeedExist(data);
    }
    getFeed();
  }, []);

  const tabsData = [
    {
      label: feedExist ? "알림 생성하기" : "피드 생성하기",
      content: feedExist ? <SendNoti></SendNoti> : <CreateFeed></CreateFeed>,
    },
    {
      label: "알림 확인하기",
      content: <NotiBox></NotiBox>,
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
      </div>
      {/* Show active tab content. */}
      <div>
        <p>{tabsData[activeTabIndex].content}</p>
      </div>
    </div>
  );
}
