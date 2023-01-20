import FeedItem from "../Feeds/FeedItem/FeedItem";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { DocumentIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { QueryCache, useQuery, QueryClient, useQueryClient } from "react-query";
import { useInView } from "react-intersection-observer";
import { useFeedsInGroup } from "../../hooks/useFeedsInGroup";
import Swal from "sweetalert2";
import { searchKeywordState } from "../../states/atom";
import { useRecoilState } from "recoil";
import SearchResultItem from "./SearchResultItem";

const SearchResults = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);
  const [searchResultFeeds, setSearchResultFeeds] = useState<object[]>([]);
  let timeoutId: NodeJS.Timeout;
  useEffect(() => {
    console.log("검색창");
    setSearchResultFeeds([]);
    // setSearchKeyword("");
    async function getSearchResultsAsync() {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/search/bar/${searchKeyword}`, // [TBD]
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      const data = response.data.data;
      console.log("searchresult: ", data);
      searchResultFeedsAdd(data);
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      getSearchResultsAsync();
    }, 1000);
  }, [searchKeyword]);

  // const autoSearchHandler = async(e: any) => {
  //    const response = await axios({
  //       method: "get",
  //       url: `${process.env.REACT_APP_HOST}/api/search/bar/${e.target.value}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.logCookie}`,
  //       },
  //     });
  //     const data = response.data.data;
  //     console.log("searchresult: ", data);
  //   // setSearchResultFeeds(data);
  //   searchResultFeedsAdd(data);

  //   }
  //   // setSearchKeyword(e.target.value);
  // };

  const searchResultFeedsAdd = (data: []) => {
    data.map((item: any) => {
      const newFeed = {
        id: item.id,
        title: item.title,
        description: item.description,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        url: item.url,
        resultinfo: item.resultinfo,
        username: item.user.nickname,
        userimage: item.user.image,
      };
      setSearchResultFeeds((oldFeeds: any) => [...oldFeeds, newFeed]);
    });
  };

  return (
    <div className="basis-2/4 ">
      <div className="rounded-lg bg-sky-500">
        {/* 메뉴바*/}
        <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl">
          <div className="flex flex-wrap items-center ">
            <div className="flex items-center">
              <span className="p-2 mr-1 -ml-3 rounded-lg bg-sky-500">
                <DocumentIcon
                  className="w-6 h-6 ml-3 text-white"
                  aria-hidden="true"
                />
              </span>
              <p className="text-xl font-bold text-white truncate">
                <span className="md:hidden">"{searchKeyword}" 검색 결과</span>
                <span className="hidden md:inline">
                  "{searchKeyword}" 검색 결과
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/*  검색결과 업승ㄹ떄 */}
      {searchResultFeeds.length === 0 ? (
        <div
          className="flex justify-center w-full h-full pt-10 mt-5 bg-white rounded-md shadow-md "
          style={{ height: "80vh" }}
        >
          <div className="flex flex-col items-center justify-center opacity-75 ">
            <p className="text-2xl font-bold text-gray-500 ">
              "{searchKeyword}" 에 해당하는 검색 결과가 없습니다.
            </p>
          </div>
        </div>
      ) : null}
      {/* feedslist section */}
      <div
        className="mt-5 rounded-md shadow-lg xl:overflow-y-auto xl:scrollbar-hide xl:h-full "
        style={{ height: "80vh" }}
      >
        <ul className="space-y-4 ">
          {searchResultFeeds &&
            searchResultFeeds.map((feed: any) => (
              <div key={feed.id} className="">
                <SearchResultItem
                  id={feed.id}
                  key={feed.id}
                  title={feed.title}
                  url={feed.url}
                  date={feed.createdAt}
                  resultinfo={feed.resultinfo}
                  // description={""}
                  // og_image={null}
                  // highlight={null}
                  writer={feed.username}
                  writerImage={feed.userimage}
                  // commentLen={0}
                  // bookmarked={false}
                  // bookmarkId={null}
                />
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchResults;
