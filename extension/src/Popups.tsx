import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { feedGenerateState } from "./states/atom";
import Tabs from "./tabs/Tabs";

export default function Popups() {
  const [loadComplete, setLoadComplete] = useState(false);
  const [feed, setFeed] = useState(null);
  const [feedGenerate, setFeedGenerate] = useRecoilState(feedGenerateState);

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
  }, [feedGenerate]);

  return <div>{loadComplete ? <Tabs feed={feed}></Tabs> : null}</div>;
}
