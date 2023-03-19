import {
  StarIcon,
  Squares2X2Icon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { FeedsInBookmark } from "./FeedsInBookmark";
import { useRecoilState } from "recoil";
import { mainSectionState, changeMainSectionState } from "../../atoms/atom";
const BookmarkFeeds = () => {
  const [mainSectionNum, setMainSectionNum] = useRecoilState(mainSectionState);
  const [changeMainSection, setChangeMainSection] = useRecoilState(
    changeMainSectionState
  );
  const clickedMainChange = () => {
    setChangeMainSection(!changeMainSection);
  };
  const handleBookmarkClick = () => {
    // console.log("bookmark click");
    // setBookmark(!bookmark);
    if (mainSectionNum === 1) {
      setMainSectionNum(0);
    } else {
      setMainSectionNum(1);
    }
  };

  return (
    <div className="basis-2/4">
      <div className="rounded-md opacity-90 bg-sky-500">
        {/* 메뉴바*/}
        <div className="px-3 py-2 mx-auto rounded-lg max-w-7xl ">
          <div className="flex flex-wrap items-center ">
            <div className="flex items-center flex-1 w-0 ">
              <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <StarIcon
                  className="w-6 h-6 ml-3 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="text-xl font-bold text-white truncate">
                <span className="md:hidden">즐겨찾기</span>
                <span className="hidden md:inline">즐겨찾기</span>
              </p>
            </div>
            <button
              onClick={handleBookmarkClick}
              className="p-1 text-white bg-sky-500 hover:bg-sky-500 "
            >
              <HomeIcon className="w-6 h-6"></HomeIcon>
            </button>
            <div className="justify-self-end">
              <Squares2X2Icon
                onClick={clickedMainChange}
                className="text-white cursor-pointer w-7 h-7 xl:block top-24 left-20 hover:text-sky-600 hover:scale-95"
              ></Squares2X2Icon>
            </div>
          </div>
        </div>
      </div>
      <FeedsInBookmark></FeedsInBookmark>
    </div>
  );
};

export default BookmarkFeeds;
