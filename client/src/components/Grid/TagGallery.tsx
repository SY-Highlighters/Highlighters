import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
  DocumentPlusIcon,
} from "@heroicons/react/24/outline";
import { useInView } from "react-intersection-observer";
import GridItem from "./GridItem/GridItem";
import GridSkeleton from "../UI/GridSkeleton";
import { activeTag } from "../../atoms/tag";
import { useTagsInGrid } from "../../hooks/Grid/useTagsInGrid";
const TagGallery = () => {
  const tagInfo = useRecoilValue(activeTag);

  const {
    getBoard,
    getNextPage,
    getBoardIsSuccess,
    getNextPageIsPossible,
    status,
  } = useTagsInGrid(tagInfo.tag_name);
  const [ref, isView] = useInView();
  // 스크롤 위아래ㅏ
  // const scrollToTop = () => {
  //   listRef.current.scrollTop = 0;
  // };
  // const scrollToBottom = () => {
  //   listRef.current.scrollTop = listRef.current.scrollHeight;
  // };
  useEffect(() => {
    // 맨 마지막 요소를 보고있고 페이지가 존재하면
    // 다음 페이지 데이터를 가져옴
    if (isView && getNextPageIsPossible) {
      getNextPage();
    }
  }, [isView, getNextPage, getNextPageIsPossible]);
  // console.log(getBoard);
  if (status === "loading") {
    return <GridSkeleton></GridSkeleton>;
  }

  return (
    <div className="py-12 mx-auto sm:py-18 sm:px-5 lg:w-full lg:px-10">
      {getBoardIsSuccess && getBoard!.pages[0].board_page.length === 0 ? (
        <div
          className="flex justify-center w-full h-full pt-10 mt-5 bg-white rounded-md "
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
      <div
        className="grid grid-cols-1 mt-6 overflow-y-auto gap-y-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8 xl:scrollbar-hide"
        style={{ height: "80vh" }}
      >
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
                      <div ref={ref} key={feed.id}>
                        <GridItem
                          index={idx}
                          key={feed.id}
                          feedId={feed.id}
                          ogImage={feed.og.image}
                          title={feed.title}
                          url={feed.url}
                        ></GridItem>
                      </div>
                    );
                  } else {
                    return (
                      <div key={feed.id}>
                        <GridItem
                          index={idx}
                          key={feed.id}
                          feedId={feed.id}
                          ogImage={feed.og.image}
                          title={feed.title}
                          url={feed.url}
                        ></GridItem>
                      </div>
                    );
                  }
                });
              })
            : null
        }
      </div>
    </div>
  );
};

export default TagGallery;
