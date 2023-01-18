import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useUserData } from "../../hooks/useUserData";
import LazyImage from "./LazyImage";
export function Grid() {
  const [cookies] = useCookies(["logCookie"]);
  // const [ref, inView] = useInView({
  //   threshold: 0.5,
  // });

  const { data: user } = useUserData(cookies);
  const [heavyList, setHeavyList] = useState([]);
  useEffect(() => {
    async function getFeed() {
      const res = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/feed/group/${user.group_id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });

      console.log(res.data.data);
      setHeavyList(res.data.data);
    }
    getFeed();
  }, []);

  return (
    // 사진첩 만들기
    <div className="box-border w-full h-full gap-3 p-5 xl:overflow-hidden xl:px-16 xl:flex-row xl:flex ">
      {/* 사진 갤러리 만들기 */}{" "}
      <div className="w-full bg-white rounded-lg shadow-md">
        {/* <h2 className="text-2xl font-bold tracking-tight text-gray-900 ml-14">
          공사중 입니다.
        </h2> */}
        <div className="py-12 mx-auto sm:py-18 sm:px-5 lg:w-full lg:px-10">
          <div
            className="grid grid-cols-1 mt-6 overflow-y-auto gap-y-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8 xl:scrollbar-hide"
            style={{ height: "80vh" }}
          >
            {heavyList &&
              heavyList.map((feed: any, index: number) => {
                return (
                  <div key={feed.id} className="relative group">
                    <div className="overflow-hidden bg-gray-200 rounded-md min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-75 lg:aspect-none lg:h-40">
                      {/* // 레이지 로딩 적용 */}
                      {/* {index < 15 ? (
                        <img
                          src={feed.og.image}
                          className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                        />
                      ) : (
                        <LazyImage
                          src={feed.og.image}
                          className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                          // threshold={200}
                          // effect="blur"
                        />
                      )} */}
                      <img
                        src={feed.og.image}
                        className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <div>
                        <h3 className="text-sm font-bold text-gray-700">
                          <a href={feed.url} target="_blank" rel="noreferrer">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {feed.title}
                          </a>
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
