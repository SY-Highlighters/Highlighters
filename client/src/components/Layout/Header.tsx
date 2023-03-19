////////////////////////로그인 전
import {
  ListBulletIcon,
  MagnifyingGlassCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState, useCallback } from "react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import {
  mainSectionState,
  optionModalToggleState,
  searchKeywordState,
} from "../../atoms/atom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useQuery } from "react-query";
import React from "react";
import { OptionModal } from "./OptionModal";
import { useQueryClient } from "react-query";
import { useUserData } from "../../hooks/useUserData";
import Swal from "sweetalert2";
export default function Header() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);

  const [searchInput, setSearchInput] = useState("");
  // const [bookmark, setBookmark] = useRecoilState(bookmarkState);
  const [mainSectionNum, setMainSectionNum] = useRecoilState(mainSectionState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const queryClient = useQueryClient();
  const [optionModalToggle, setOptionModalToggle] = useRecoilState(
    optionModalToggleState
  );
  // const resetFeeds = useResetRecoilState(groupFeedListState);
  // react-query 사용 시 server state
  const { data: user, isSuccess } = useUserData();

  const logout = async () => {
    queryClient.removeQueries();
    removeCookie("logCookie");
  };
  // 메인 로고 눌렀을때 새로고침
  const handleLogoClick = () => {
    window.location.reload();
  };
  const userMenuClicked = () => {
    setNavbarOpen(!navbarOpen);
  };
  const optionClicked = () => {
    setOptionModalToggle(!optionModalToggle);
  };

  const searchButtonClicked = () => {
    if (searchInput === "") {
      Swal.fire({
        icon: "warning",
        title: "검색어를 입력해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (mainSectionNum !== 4) {
      setMainSectionNum(4);
    }
    setSearchKeyword(searchInput);
  };
  // 검색 인풋
  const handleSearchInputChange = (event: any) => {
    // // 자동완성
    // if (event?.target.value === "") {
    //   setSearchKeyword("");
    //   setMainSectionNum(0);
    //   return;
    // }

    // if (mainSectionNum !== 4) {
    //   setMainSectionNum(4);
    // }
    // setSearchKeyword(event?.target.value);
    setSearchInput(event?.target.value);
  };

  // enter event handler
  const activeEnter = (e: any) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter") {
      searchButtonClicked();
    }
  };

  return (
    <>
      <nav className="sticky flex px-2 py-3 bg-sky-600">
        <div className="flex w-full px-10">
          <div className="flex flex-row basis-1/3 ">
            <div className="flex items-center justify-between text-white">
              <span
                onClick={handleLogoClick}
                className="text-xl font-semibold tracking-tight cursor-pointer sm:text-2xl"
              >
                Highlighters
              </span>
              {/* 유저 프로필 버튼 */}
              {/* <img
                className="flex rounded-full cursor-pointer w-9 h-9 hover:opacity-75"
                src={
                  isSuccess && user.image
                    ? user.image
                    : "https://via.placeholder.com/150"
                }
                alt=""
              ></img> */}
            </div>
            {/* <div>
              <button
                className="absolute block px-3 py-3 text-xl border border-transparent border-solid rounded outline-none cursor-pointer right-1 lg:hidden focus:outline-none"
                type="button"
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div> */}
          </div>
          <div
            className={
              "lg:flex flex-grow items-center flex basis-1/3" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            {/* 검색창 기능 */}
            {/*일단 뺐는데  lg:max-w-xs 작은사이즈 설정같음 -> 확인하자 */}
            <div className="flex w-full basis-1/2 lg:flex-row ">
              <label htmlFor="search" className="sr-only">
                Search
              </label>

              <MagnifyingGlassCircleIcon
                className="w-8 h-8 mt-1 text-white cursor-pointer"
                onClick={searchButtonClicked}
              ></MagnifyingGlassCircleIcon>
              <div className="w-full text-white focus-within:text-gray-600">
                <div className="flex items-center">{/* 검색 icon */}</div>
                <input
                  id="search"
                  name="search"
                  className="block w-full py-2 pl-8 pr-3 text-sm text-white placeholder-gray-400 border border-transparent rounded-md bg-sky-600 focus:outline-none focus:placeholder-gray-400 focus:bg-white focus:text-gray-900 focus:border-white focus:ring-0 sm:text-sm"
                  placeholder="검색어를 입력하세요!"
                  type="search"
                  onKeyDown={activeEnter}
                  onChange={handleSearchInputChange}
                ></input>
              </div>
            </div>
            {/* <ul className="flex flex-col list-none lg:flex-row lg:ml-auto"> */}
            <ul className="flex flex-col mr-3 space-x-2 list-none lg:flex-row lg:ml-auto">
              <li className="mt-1 nav-item"></li>
              <li className="nav-item">
                {/* 유저 프로필 버튼 */}
                {isSuccess && user.image ? (
                  <img
                    onClick={userMenuClicked}
                    className="rounded-full cursor-pointer w-9 h-9 hover:opacity-75 "
                    src={user.image}
                    alt=""
                  ></img>
                ) : (
                  <div className="bg-gray-300 rounded-full w-9 h-9 "></div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* 네브바 메뉴바 */}

      {/* 프로필 탭 */}
      {navbarOpen && (
        <div className="absolute inline-flex rounded-md bg-sky-500 right-3 top-12">
          <div className="relative">
            <div className="absolute right-0 z-10 w-56 mt-4 origin-top-right bg-white border rounded-md shadow-lg">
              <div className="p-2">
                {/* <span
                  onClick={optionClicked}
                  className="block px-4 py-2 text-sm text-gray-500 rounded-lg cursor-pointer hover:bg-gray-50 hover:text-gray-700"
                >
                  설정
                </span> */}
                <span
                  onClick={logout}
                  className="block px-4 py-2 text-sm text-gray-500 rounded-lg cursor-pointer hover:bg-gray-50 hover:text-gray-700"
                >
                  로그아웃
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {optionModalToggle && <OptionModal userImg={user?.image}></OptionModal>}
      {/* 모바일 메뉴 */}
      {/* <div onClick={setNavbarOpen}>
        <ListBulletIcon className="absolute block text-white cursor-pointer h-7 right-2 top-3 hover:opacity-75 lg:hidden"></ListBulletIcon>
      </div> */}
    </>
  );
}

// 디바운싱 함수 라이브러리없이 구현하기
const debounce = (callback: any, duration: any) => {
  let timer: any;
  return (...args: any) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), duration);
  };
};
