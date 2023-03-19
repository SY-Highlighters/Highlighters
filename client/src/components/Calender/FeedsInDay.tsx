import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useEffect, useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useInView } from "react-intersection-observer";
import { useRecoilValue } from "recoil";
import { selectedDayState } from "../../atoms/atom";
import { useFeedsInDay } from "../../hooks/useFeedsInDay";
import FeedSkeleton from "../UI/FeedSkeleton";
export function FeedsInDay(props: any) {
  const [ref, isView] = useInView();
  const selectedDay = useRecoilValue(selectedDayState);
  const date = new Date(selectedDay);
  // 9시간 뺴서 한국 시간으로 변환
  date.setHours(date.getHours() - 9);
  // 쓰로틀 적용
  const {
    getBoard,
    getNextPage,
    getBoardIsSuccess,
    getNextPageIsPossible,
    status,
  } = useFeedsInDay(date);
  // console.log("여기야", getBoard);
  useEffect(() => {
    // 맨 마지막 요소를 보고있고 페이지가 존재하면
    if (isView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [isView, getNextPage, getNextPageIsPossible]);

  if (status === "loading") {
    return <FeedSkeleton></FeedSkeleton>;
  }
  return (
    // <div className="xl:ml-20 justify-self-center xl:w-3/6">
    <>
      {getBoardIsSuccess && getBoard!.pages[0].board_page.length === 0 ? (
        <div
          className="flex justify-center w-full h-full pt-10 mt-5 bg-white rounded-md shadow-md "
          style={{ height: "80vh" }}
        >
          <div className="flex flex-col items-center justify-center opacity-75 ">
            <div className="flex items-center justify-center w-20 h-20 mb-3 rounded-full bg-sky-500">
              <CalendarDaysIcon
                className="w-10 h-10 text-white"
                aria-hidden="true"
              />
            </div>
            <p className="text-2xl font-bold text-gray-500 ">
              해당 일자에는 피드가 없어요 😂
            </p>
          </div>
        </div>
      ) : null}
      {/* feedslist section */}
      <div
        className="mt-5 rounded-md xl:overflow-y-auto xl:scrollbar-hide xl:h-full"
        style={{ height: "80vh" }}
      >
        <ul className="space-y-4 ">
          {
            // 데이터를 불러오는데 성공하고 데이터가 0개가 아닐 때 렌더링
            getBoardIsSuccess && getBoard!.pages
              ? getBoard!.pages.map((page_data, page_num) => {
                  const board_page = page_data.board_page;
                  return board_page.map((feed: any, idx: any) => {
                    console.log("피드 하나", feed);
                    if (
                      // 마지막 요소에 ref 달아주기
                      getBoard!.pages.length - 1 === page_num &&
                      board_page.length - 1 === idx
                    ) {
                      return (
                        // 마지막 요소에 ref 넣기 위해 div로 감싸기
                        <div ref={ref} key={feed.id + date} className="">
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
                      return (
                        <div key={feed.id + date} className="">
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
                    }
                  });
                })
              : null
          }
          {/* {feedsInGroup &&
            feedsInGroup.map((feed: any) => (
              <div key={feed.id} className="mb-4">
                <FeedItem
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
                  bookmarked={feed.bookmark.length !== 0 ? true : false}
                  bookmarkId={feed.bookmark[0]}
                />
              </div>
            ))} */}
        </ul>
      </div>
    </>
  );
}
function thrrottle(callback: any, limit: any) {
  let wait = false;
  return function () {
    if (!wait) {
      callback.apply(null, arguments);
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
  };
}
