import { useEffect, useState } from "react";
// import CreateFeed from "./tabs/CreateFeed";
// import SendNoti from "./tabs/SendNoti";
// import NotiBox from "./tabs/NotiBox";
import Tabs from "./tabs/Tabs";

export default function Popups() {
  // const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [loadComplete, setLoadComplete] = useState(false);
  // let feedExist = true;
  const [feedExist, setFeedExist] = useState(0);

  useEffect(() => {
    async function getFeed() {
      let response = await chrome.runtime.sendMessage({
        greeting: "getFeed",
      });
      const result = response.data.data;
      const exist = result !== null ? 1 : 0;
      setFeedExist(exist);
      setLoadComplete(true);
    }
    getFeed();
  }, []);

  return <div>{loadComplete ? <Tabs feedExist={feedExist}></Tabs> : null}</div>;
}
