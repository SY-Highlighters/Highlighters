import FeedItem from "./FeedItem/FeedItem";
import { useEffect, useState, useRef } from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import { useInView } from "react-intersection-observer";
import { useFeedsInGroup } from "../../hooks/useFeedsInGroup";
import FeedSkeleton from "../UI/FeedSkeleton";
import LazyLoad from "react-lazy-load";

const FeedsInGroup = () => {
  const {
    getBoard,
    getNextPage,
    getBoardIsSuccess,
    getNextPageIsPossible,
    status,
  } = useFeedsInGroup();
  const [ref, isView] = useInView();
  const listRef = useRef(null);

  useEffect(() => {
    // 맨 마지막 요소를 보고있고 페이지가 존재하면
    // 다음 페이지 데이터를 가져옴
    if (isView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [isView, getNextPage, getNextPageIsPossible]);
  // console.log("여긴 피드",getBoard);
  if (status === "loading") {
    return <FeedSkeleton></FeedSkeleton>;
  }
  return (
    <>
      {getBoardIsSuccess && getBoard!.pages[0].board_page.length === 0 ? (
        <div
          className="flex justify-center w-full h-full pt-10 mt-5 bg-white rounded-md shadow-md "
          style={{ height: "80vh" }}
        >
          <div className="flex flex-col items-center justify-center opacity-75 ">
            <div className="flex items-center justify-center w-20 h-20 mb-3 rounded-full bg-sky-500">
              <DocumentPlusIcon
                className="w-10 h-10 text-white"
                aria-hidden="true"
              />
            </div>
            <p className="text-2xl font-bold text-gray-500 ">
              아직 피드가 없어요 😂
            </p>
          </div>
        </div>
      ) : null}
      {/* <button onClick={scrollToTop}>Scroll to Top</button>
      <button onClick={scrollToBottom}>Scroll to Bottom</button> */}
      {/* feedslist section */}
      <div
        ref={listRef}
        className="mt-5 rounded-md shadow-lg xl:overflow-y-auto xl:scrollbar-hide xl:h-full "
        style={{ height: "80vh" }}
      >
        <ul className="space-y-4 ">
          {
            // 데이터를 불러오는데 성공하고 데이터가 0개가 아닐 때 렌더링
            getBoardIsSuccess && getBoard!.pages
              ? getBoard!.pages.map((page_data, page_num) => {
                  const board_page = page_data.board_page;
                  return board_page.map((feed: any, idx: any) => {
                    // console.log(feed);
                    if (
                      // 마지막 요소에 ref 달아주기
                      getBoard!.pages.length - 1 === page_num &&
                      board_page.length - 1 === idx
                    ) {
                      return (
                        // 마지막 요소에 ref 넣기 위해 div로 감싸기
                        <div ref={ref} key={feed.id} className="">
                          <FeedItem
                            idx={idx}
                            id={feed.id}
                            key={feed.id}
                            title={feed.title}
                            description={feed.og.description}
                            og_image={feed.og.image}
                            url={feed.url}
                            highlight={feed.highlight}
                            date={feed.createdAt}
                            tag={feed.tag}
                            writer={feed.user.nickname}
                            writerImg={feed.user.image}
                            commentLen={feed.comment.length}
                            bookmarked={
                              feed.bookmark.length !== 0 ? true : false
                            }
                            bookmarkId={feed.bookmark[0]}
                            summary={feed.summary}
                          />
                        </div>
                      );
                    } else {
                      // if (idx < 3) {
                      return (
                        <div key={feed.id} className="">
                          <FeedItem
                            idx={idx}
                            id={feed.id}
                            key={feed.id}
                            title={feed.title}
                            description={feed.og.description}
                            og_image={feed.og.image}
                            url={feed.url}
                            highlight={feed.highlight}
                            date={feed.createdAt}
                            tag={feed.tag}
                            writer={feed.user.nickname}
                            writerImg={feed.user.image}
                            commentLen={feed.comment.length}
                            bookmarked={
                              feed.bookmark.length !== 0 ? true : false
                            }
                            bookmarkId={feed.bookmark[0]}
                            summary={feed.summary}
                          />
                        </div>
                      );
                      // } else {
                      //   return (
                      //     <LazyLoad>
                      //       <div key={feed.id} className="">
                      //         <FeedItem
                      //           idx={idx}
                      //           id={feed.id}
                      //           key={feed.id}
                      //           title={feed.title}
                      //           description={feed.og.description}
                      //           og_image={feed.og.image}
                      //           url={feed.url}
                      //           highlight={feed.highlight}
                      //           date={feed.createdAt}
                      //           tag={feed.tag}
                      //           writer={feed.user.nickname}
                      //           writerImg={feed.user.image}
                      //           commentLen={feed.comment.length}
                      //           bookmarked={
                      //             feed.bookmark.length !== 0 ? true : false
                      //           }
                      //           bookmarkId={feed.bookmark[0]}
                      //           summary={feed.summary}
                      //         />
                      //       </div>
                      //     </LazyLoad>
                      //   );
                      // }
                    }
                  });
                })
              : null
          }
        </ul>
      </div>
    </>
  );
};

export default FeedsInGroup;
