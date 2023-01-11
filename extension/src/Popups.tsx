import { useEffect, useState } from "react";
// import CreateFeed from "./tabs/CreateFeed";
// import SendNoti from "./tabs/SendNoti";
// import NotiBox from "./tabs/NotiBox";
import Tabs from "./tabs/Tabs";

export default function Popups() {
  // const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [loadComplete, setLoadComplete] = useState(false);
  const [feed, setFeed] = useState(null);
  // let feedExist = true;
  // const [feedExist, setFeedExist] = useState(0);

  useEffect(() => {
    async function getFeed() {
      let response = await chrome.runtime.sendMessage({
        greeting: "getFeed",
      });
      console.log(response);
      const result = response.data.data;
      console.log(result);
      setFeed(result);
      setLoadComplete(true);
    }
    getFeed();
  }, []);

  return <div>{loadComplete ? <Tabs feed={feed}></Tabs> : null}</div>;
}
