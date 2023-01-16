import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useEffect, useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useInView } from "react-intersection-observer";
import { useInfiniteFeed } from "../../hooks/useInfiniteFeed";
import { useRecoilValue } from "recoil";
import { selectedDayState } from "../../states/atom";
export function FeedsDay(props: any) {
  const { getBoard, getNextPage, getBoardIsSuccess, getNextPageIsPossible } =
    useInfiniteFeed();
  const [ref, isView] = useInView();

  const selectedDay = useRecoilValue(selectedDayState);
  // 날짜 문자로 변환
  const date = new Date(selectedDay);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  useEffect(() => {
    // 맨 마지막 요소를 보고있고 페이지가 존재하면
    // 다음 페이지 데이터를 가져옴
    if (isView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [isView, getNextPage, getNextPageIsPossible]);

  return (
    // <div className="xl:ml-20 justify-self-center xl:w-3/6">
    <div className="basis-2/4">
      {/* 위에 여백 두고 그룹피드 타이틀 만들기 */}
      {/* 그룹 피드 타이틀 ver1*/}
      {/* <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl antialiased font-bold text-whtie">그룹 피드</h1>
      </div> */}
      {/* 그룹 피드 타이틀 ver2 */}
      <div className="rounded-lg bg-sky-500">
        {/* 메뉴바*/}
        <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl">
          <div className="flex flex-wrap items-center ">
            <div className="flex items-center flex-1 w-0 ">
              <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <CalendarDaysIcon
                  className="w-6 h-6 ml-3 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="text-xl font-bold text-white truncate">
                <span className="">{`${year}년 ${month}월 ${day}일`}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* feedslist section */}
      <div className="mt-5 rounded-md shadow-lg xl:overflow-y-auto xl:scrollbar-hide xl:h-full">
        <ul className="space-y-4 ">
          {
            // 데이터를 불러오는데 성공하고 데이터가 0개가 아닐 때 렌더링
            getBoardIsSuccess && getBoard!.pages
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
                            bookmarked={
                              feed.bookmark.length !== 0 ? true : false
                            }
                            bookmarkId={feed.bookmark[0]}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={feed.id} className="">
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
                            bookmarked={
                              feed.bookmark.length !== 0 ? true : false
                            }
                            bookmarkId={feed.bookmark[0]}
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
    </div>
  );
}
