import { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useFeedsInGrid } from "../../hooks/useFeedsInGrid";

export function TestGrid() {
  const { getBoard, getNextPage, getBoardIsSuccess, getNextPageIsPossible } =
    useFeedsInGrid();
  const [ref, isView] = useInView();

  useEffect(() => {
    // 맨 마지막 요소를 보고있고 페이지가 존재하면
    // 다음 페이지 데이터를 가져옴
    if (isView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [isView, getNextPage, getNextPageIsPossible]);

  return (
    // 사진첩 만들기
    <div className="box-border w-full h-full gap-3 p-5 xl:overflow-hidden xl:px-16 xl:flex-row xl:flex animate-fade-in-down ">
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
            {getBoardIsSuccess && getBoard!.pages
              ? getBoard!.pages.map((page_data, page_num) => {
                  const board_page = page_data.board_page;
                  return board_page.map((feed: any, idx: any) => {
                    if (
                      // 마지막 요소에 ref 달아주기
                      getBoard!.pages.length - 1 === page_num &&
                      board_page.length - 1 === idx
                    ) {
                      return (
                        // 마지막 요소에 ref 넣기 위해 div로 감싸기
                        <div ref={ref} key={feed.id} className="">
                          <div key={feed.id} className="relative group">
                            <div className="overflow-hidden bg-gray-200 rounded-md min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-75 lg:aspect-none lg:h-40">
                              <img
                                src={feed.og.image}
                                alt=""
                                className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                              />
                            </div>
                            <div className="flex justify-between mt-2">
                              <div>
                                <h3 className="text-sm font-bold text-gray-700">
                                  <a href={feed.url}>
                                    <span
                                      aria-hidden="true"
                                      className="absolute inset-0"
                                    />
                                    {feed.title}
                                  </a>
                                </h3>
                                {/* <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p> */}
                              </div>
                              {/* 돈뜨던곳 */}
                              {/* <p className="text-sm font-medium text-gray-900">
                    {product.price}
                  </p> */}
                            </div>
                          </div>
                          ;
                        </div>
                      );
                    } else {
                      return (
                        <div key={feed.id} className="">
                          <div key={feed.id} className="relative group">
                            <div className="overflow-hidden bg-gray-200 rounded-md min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-75 lg:aspect-none lg:h-40">
                              <img
                                src={feed.og.image}
                                alt=""
                                className="object-cover object-center w-full h-full lg:h-full lg:w-full"
                              />
                            </div>
                            <div className="flex justify-between mt-2">
                              <div>
                                <h3 className="text-sm font-bold text-gray-700">
                                  <a href={feed.url}>
                                    <span
                                      aria-hidden="true"
                                      className="absolute inset-0"
                                    />
                                    {feed.title}
                                  </a>
                                </h3>
                                {/* <p className="mt-1 text-sm text-gray-500">
                      {product.color}
                    </p> */}
                              </div>
                              {/* 돈뜨던곳 */}
                              {/* <p className="text-sm font-medium text-gray-900">
                    {product.price}
                  </p> */}
                            </div>
                          </div>
                        </div>
                      );
                    }
                  });
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}
