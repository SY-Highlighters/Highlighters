import axios from "axios";
import { useState } from "react";
import { useCookies } from "react-cookie";

const dummary = "현재 네이버 뉴스만 지원합니다 😂";

const ThreeLineSummary = (props: any) => {
  const [summary, setSummary] = useState("");
  const [threeTrigger, setThreeTrigger] = useState(false);
  const [cookies] = useCookies(["logCookie"]);

  // 세줄요약 api
  const clickThreeLineSummaryHandler = async () => {
    if (!threeTrigger ){
      const threeLineSummaryResult = await axios({
        method: "post",
        url: `${process.env.REACT_APP_HOST}/api/summary`,
        data: {
          url: props.url,
          id: props.id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      setSummary(threeLineSummaryResult.data.data.summary);
      console.log(threeLineSummaryResult.data);
    }
    setThreeTrigger(!threeTrigger);
  };

  return (
    <>
      <div
        onClick={clickThreeLineSummaryHandler}
        className="my-1 text-sm font-bold text-gray-500 cursor-pointer hover:text-gray-700"
      >
        <span className="mr-1 text-xl">🤖</span> "3줄로 요약해줘"
      </div>
      <div className="">
        {threeTrigger &&
          summary.split("\n").map((line, index) => (
            <div
              className="mt-1 text-sm font-bold ml-7 text-sky-400 animate-fade-in-down"
              key={index}
            >
              {index + 1}. {line} <br />
            </div>
          ))}
      </div>
    </>
  );
};

export default ThreeLineSummary;
