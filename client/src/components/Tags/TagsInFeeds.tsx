import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";
import { activeTag } from "../../atoms/tag";
// import { userInfo } from "../../atoms/user";
// import { useEffect, useState } from "react";
import { useEffect } from "react";
import { useFeedsInTag } from "../../hooks/useFeedsInTag";
import { useInView } from "react-intersection-observer";
import FeedSkeleton from "../UI/FeedSkeleton";

const TagsInFeeds = () => {
  // const [tagFeedList, setTagFeedList] = useRecoilState(feedsTagListState);
  // const [feedsTagList, setFeedsTagList] = useState([]);
  const tagInfo = useRecoilValue(activeTag);
  const [ref, isView] = useInView();
  const {
    getBoard,
    getNextPage,
    getBoardIsSuccess,
    getNextPageIsPossible,
    status,
  } = useFeedsInTag(tagInfo.tag_name);

  // const resetClickedTag = useResetRecoilState(activeTag);

  useEffect(() => {
    // 맨 마지막 요소를 보고있고 페이지가 존재하면
    // 다음 페이지 데이터를 가져옴
    if (isView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [isView, getNextPage, getNextPageIsPossible, tagInfo.tag_name]);
  // clickTag가 변경시 새로운 쿼리를 요청
  // console.log("태그가져오기", getBoard);
  if (status === "loading") {
    return <FeedSkeleton></FeedSkeleton>;
  }
  return (
    <div className="">
      {/* feedslist section */}
      <div
        className="mt-5 rounded-md xl:overflow-y-auto xl:scrollbar-hide xl:h-full "
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

export default TagsInFeeds;
