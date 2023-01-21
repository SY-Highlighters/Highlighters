import { DocumentIcon } from "@heroicons/react/24/outline";
import AvailableFeeds from "./AvailableFeeds";
import { Suspense, lazy } from "react";
import FeedSkeleton from "../UI/FeedSkeleton";
// const AvailableFeeds = lazy(() => import("./AvailableFeeds"));

const Feed = () => {
  return (
    <div className="basis-2/4">
      {/* 위에 여백 두고 그룹피드 타이틀 만들기 */}
      {/* 그룹 피드 타이틀 ver1*/}
      {/* <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl antialiased font-bold text-whtie">그룹 피드</h1>
      </div> */}
      {/* 그룹 피드 타이틀 ver2 */}
      <div className="rounded-md opacity-90 bg-sky-500">
        {/* 메뉴바*/}
        <div className="px-3 py-2 mx-auto rounded-lg max-w-7xl ">
          <div className="flex flex-wrap items-center ">
            <div className="flex items-center flex-1 w-0 ">
              <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <DocumentIcon
                  className="w-6 h-6 ml-3 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="text-xl font-bold text-white truncate ">
                <span className="md:hidden">그룹 피드</span>
                <span className="hidden md:inline">그룹 피드</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* <Suspense fallback={<FeedSkeleton/>}> */}
      <AvailableFeeds></AvailableFeeds>
      {/* </Suspense> */}
    </div>
  );
};

export default Feed;
