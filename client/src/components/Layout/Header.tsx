////////////////////////로그인 전
import {
  ListBulletIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import { mainSectionState, optionModalToggleState } from "../../states/atom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useQuery } from "react-query";
import React from "react";
import { OptionModal } from "./OptionModal";

export default function Header() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  // const [bookmark, setBookmark] = useRecoilState(bookmarkState);
  const [mainSectionNum, setMainSectionNum] = useRecoilState(mainSectionState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [optionModalToggle, setOptionModalToggle] = useRecoilState(
    optionModalToggleState
  );
  // const resetFeeds = useResetRecoilState(groupFeedListState);
  // react-query 사용 시 server state
  const { data: user, isSuccess } = useQuery(
    ["user"],
    async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/api/user/signin`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.logCookie}`,
            },
          }
        );
        return res.data;
      } catch (err) {
        console.error(err);
      }
    },
    {
      // cacheTime: 60 * 60 * 1000,
      // 1시간동안 캐시를 사용한다.
      cacheTime: 60 * 60 * 1000,
      staleTime: 2 * 60 * 60 * 1000,
      // Refetch the data when the component mounts, including when the page is refreshed
      refetchOnMount: false,
      // Do not refetch the data when the window gains focus
      refetchOnWindowFocus: false,
      // 쿠키가 준비되었을때 쿼리를 실행한다.
    }
  );
  const handleBookmarkClick = () => {
    console.log("bookmark click");
    // setBookmark(!bookmark);
    if (mainSectionNum === 1) {
      setMainSectionNum(0);
    } else {
      setMainSectionNum(1);
    }
  };
  const logout = () => {
    // resetFeeds();
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

              <MagnifyingGlassCircleIcon className="w-8 h-8 mt-1 text-white"></MagnifyingGlassCircleIcon>
              <div className="w-full text-white focus-within:text-gray-600">
                <div className="flex items-center">{/* 검색 icon */}</div>
                <input
                  id="search"
                  name="search"
                  className="block w-full py-2 pl-8 pr-3 text-sm text-white placeholder-gray-400 border border-transparent rounded-md bg-sky-600 focus:outline-none focus:placeholder-gray-400 focus:bg-white focus:text-gray-900 focus:border-white focus:ring-0 sm:text-sm"
                  placeholder="검색어를 입력하세요!"
                  type="search"
                ></input>
              </div>
            </div>
            {/* <ul className="flex flex-col list-none lg:flex-row lg:ml-auto"> */}
            <ul className="flex flex-col mr-3 space-x-2 list-none lg:flex-row lg:ml-auto">
              <li className="mt-1 nav-item">
                {mainSectionNum === 1 ? (
                  <button
                    onClick={handleBookmarkClick}
                    type="button"
                    className="p-1 text-white rounded-full bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-500 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    <HomeIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    onClick={handleBookmarkClick}
                    className="p-1 text-white rounded-full bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-500 focus:ring-white"
                  >
                    <span className="sr-only">View notifications</span>
                    {/* <!-- Heroicon name: outline/bell --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 17h8m0 0v-6m0 6a2 2 0 11-4 0 2 2 0 014 0zm-6 0h.01M6 17h.01M18 6a2 2 0 00-2-2H8a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V6z"
                      />
                    </svg>
                  </button>
                )}
              </li>
              <li className="nav-item">
                {/* 유저 프로필 버튼 */}
                <img
                  onClick={userMenuClicked}
                  className="rounded-full cursor-pointer w-9 h-9 hover:opacity-75 "
                  src={
                    isSuccess && user.image
                      ? user.image
                      : "https://via.placeholder.com/150"
                  }
                  alt=""
                ></img>
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
                <span
                  onClick={optionClicked}
                  className="block px-4 py-2 text-sm text-gray-500 rounded-lg cursor-pointer hover:bg-gray-50 hover:text-gray-700"
                >
                  설정
                </span>
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
      {optionModalToggle && <OptionModal></OptionModal>}
      {/* 모바일 메뉴 */}
      {/* <div onClick={setNavbarOpen}>
        <ListBulletIcon className="absolute block text-white cursor-pointer h-7 right-2 top-3 hover:opacity-75 lg:hidden"></ListBulletIcon>
      </div> */}
    </>
  );
}
