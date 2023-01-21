const FeedSkeleton = () => {
  return (
    <ul className="w-full mt-5 space-y-4 opacity-50">
      {/* 피드 아이템 하나 */}
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg animate-pulse">
        <div className="flex justify-between">
          <div className="flex flex-row items-center px-3 mt-3 text-xs text-gray-500 xl:text-sm ">
            <div className="w-4 h-4 mr-2 bg-gray-300 rounded-md "></div>
            <div className="h-4 mr-2 bg-gray-300 rounded-md mr-1w-4 xl:h-4 xl:w-4 "></div>

            <div className="w-20 h-4 bg-gray-300 rounded-md "></div>
          </div>
          {/* 글쓴이 */}
          <div className="relative flex items-end px-3 justify-left ">
            <div className="flex flex-col ml-2 space-y-2 ">
              <div className="w-10 h-4 mb-1 mr-1 bg-gray-300 rounded-md "></div>
            </div>
            <div className="w-6 h-6 bg-gray-300 rounded-full "></div>
          </div>
        </div>
        {/* 피드 정보들 */}
        <div className="m-5 sm:px-6">
          {/*  타이틀 */}
          <span>
            <div className="w-1/2 h-6 bg-gray-300 rounded-md "></div>
          </span>

          <div className="mt-2 ">
            <div className="relative flex items-end px-3 justify-left">
              <div className="w-6 h-6 bg-gray-300 rounded-full "></div>

              <div className="flex flex-col ml-2 space-y-2 ">
                <div className="w-40 h-5 bg-gray-300 rounded-md "></div>
              </div>
            </div>
          </div>
          <div className="w-full bg-white rounded-lg shadow-lg ">
            <div className="h-8" />
            <div className="relative p-6 rounded-3xl -top-5">
              <div className="relative flex items-end px-3 justify-left -top-1">
                <div className="bg-gray-300 rounded-mg w-14 h-14 "></div>

                <div className="flex flex-col ml-3 space-y-2 ">
                  <div className="w-20 h-4 bg-gray-300 rounded-md "></div>
                  <div className="w-24 h-6 bg-gray-300 rounded-md "></div>
                </div>
              </div>
            </div>
          </div>
          {/* 태그 section */}
          <div className="flex flex-wrap space-x-2">
            <div className="w-10 h-4 mt-2 bg-gray-300 rounded-md "></div>
            <div className="w-10 h-4 mt-2 bg-gray-300 rounded-md "></div>
            <div className="w-10 h-4 mt-2 bg-gray-300 rounded-md "></div>
          </div>

          {/* 태그 수정 section */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500 ">
            <div className="w-10 h-4 mt-2 bg-gray-300 rounded-md "></div>

            {/* 댓글 , 즐겨찾기 section*/}
            <div className="">
              <div className="flex flex-row space-x-2">
                <div className="w-6 h-6 mt-2 bg-gray-300 rounded-md "></div>
                <div className="w-6 h-6 mt-2 bg-gray-300 rounded-md "></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg animate-pulse">
        <div className="flex justify-between">
          <div className="flex flex-row items-center px-3 mt-3 text-xs text-gray-500 xl:text-sm ">
            <div className="w-4 h-4 mr-2 bg-gray-300 rounded-md "></div>
            <div className="h-4 mr-2 bg-gray-300 rounded-md mr-1w-4 xl:h-4 xl:w-4 "></div>

            <div className="w-20 h-4 bg-gray-300 rounded-md "></div>
          </div>
          {/* 글쓴이 */}
          <div className="relative flex items-end px-3 justify-left ">
            <div className="flex flex-col ml-2 space-y-2 ">
              <div className="w-10 h-4 mb-1 mr-1 bg-gray-300 rounded-md "></div>
            </div>
            <div className="w-6 h-6 bg-gray-300 rounded-full "></div>
          </div>
        </div>
        {/* 피드 정보들 */}
        <div className="m-5 sm:px-6">
          {/*  타이틀 */}
          <span>
            <div className="w-1/2 h-6 bg-gray-300 rounded-md "></div>
          </span>

          <div className="mt-2 ">
            <div className="relative flex items-end px-3 justify-left">
              <div className="w-6 h-6 bg-gray-300 rounded-full "></div>

              <div className="flex flex-col ml-2 space-y-2 ">
                <div className="w-40 h-5 bg-gray-300 rounded-md "></div>
              </div>
            </div>
          </div>
          <div className="w-full bg-white rounded-lg shadow-lg ">
            <div className="h-8" />
            <div className="relative p-6 rounded-3xl -top-5">
              <div className="relative flex items-end px-3 justify-left -top-1">
                <div className="bg-gray-300 rounded-mg w-14 h-14 "></div>

                <div className="flex flex-col ml-3 space-y-2 ">
                  <div className="w-20 h-4 bg-gray-300 rounded-md "></div>
                  <div className="w-24 h-6 bg-gray-300 rounded-md "></div>
                </div>
              </div>
            </div>
          </div>
          {/* 태그 section */}
          <div className="flex flex-wrap space-x-2">
            <div className="w-10 h-4 mt-2 bg-gray-300 rounded-md "></div>
            <div className="w-10 h-4 mt-2 bg-gray-300 rounded-md "></div>
            <div className="w-10 h-4 mt-2 bg-gray-300 rounded-md "></div>
          </div>

          {/* 태그 수정 section */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-500 ">
            <div className="w-10 h-4 mt-2 bg-gray-300 rounded-md "></div>

            {/* 댓글 , 즐겨찾기 section*/}
            <div className="">
              <div className="flex flex-row space-x-2">
                <div className="w-6 h-6 mt-2 bg-gray-300 rounded-md "></div>
                <div className="w-6 h-6 mt-2 bg-gray-300 rounded-md "></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ul>
  );
};

export default FeedSkeleton;
