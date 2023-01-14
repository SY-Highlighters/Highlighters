import { useEffect, useState } from "react";
// import CreateFeed from "./tabs/CreateFeed";
// import SendNoti from "./tabs/SendNoti";
// import NotiBox from "./tabs/NotiBox";
import Tabs from "./tabs/Tabs";

export default function Popups() {
  const [loadComplete, setLoadComplete] = useState(false);
  const [feed, setFeed] = useState(null);

  useEffect(() => {
    async function getFeed() {
      let response = await chrome.runtime.sendMessage({
        greeting: "getFeed",
      });
      const result = response.data.data;
      console.log("[getFeed] result: ", result);
      setFeed(result);
      setLoadComplete(true);
    }
    getFeed();
  }, []);

  return <div>{loadComplete ? <Tabs feed={feed}></Tabs> : null}</div>;
}
