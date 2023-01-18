import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import {
  feedsInGroupState,
  tagsInFeedState,
  clickedTagState,
  userInfoState,
  feedsTagListState,
} from "../../states/atom";
import { useCookies } from "react-cookie";
// import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect } from "react";
import { useFeedsInTag } from "../../hooks/useFeedsInTag";
import { useInView } from "react-intersection-observer";

const AvailableTags = () => {
  // const [tagFeedList, setTagFeedList] = useRecoilState(feedsTagListState);
  // const [feedsTagList, setFeedsTagList] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const clickedTag = useRecoilValue(clickedTagState);
  const [ref, isView] = useInView();
  const { getBoard, getNextPage, getBoardIsSuccess, getNextPageIsPossible } =
    useFeedsInTag(clickedTag.tag_name);

  const resetClickedTag = useResetRecoilState(clickedTagState);

  useEffect(() => {
    // 맨 마지막 요소를 보고있고 페이지가 존재하면
    // 다음 페이지 데이터를 가져옴
    if (isView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [isView, getNextPage, getNextPageIsPossible, clickedTag.tag_name]);
  // clickTag가 변경시 새로운 쿼리를 요청
  console.log("태그가져오기", getBoard);
  return (
    <div className="basis-2/4">
      <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl antialiased font-bold text-whtie">
          <span className="inline-flex items-center mr-2 px-3 py-0.5 rounded-full text-xl font-bold bg-sky-100 text-sky-800">
            # {clickedTag.tag_name}
          </span>
        </h1>
      </div>
      {/* feedslist section */}
      <div
        className="rounded-md shadow-lg mt-7 xl:overflow-y-auto xl:scrollbar-hide xl:h-full "
        style={{ height: "80vh" }}
      >
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
        </ul>
      </div>
    </div>
  );
};

export default AvailableTags;
