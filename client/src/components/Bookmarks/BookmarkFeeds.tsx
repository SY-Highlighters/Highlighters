import { StarIcon } from "@heroicons/react/24/outline";
import { FeedsInBookmark } from "./FeedsInBookmark";
const BookmarkFeeds = () => {
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
          </div>
        </div>
      </div>
      <FeedsInBookmark></FeedsInBookmark>
    </div>
  );
};

export default BookmarkFeeds;
