import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import {
  useRecoilState,
} from "recoil";
import { mainSectionState } from "../../atoms/atom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useQuery } from "react-query";
// const user = {
//   name: "김성태",
//   email: "tom@example.com",
//   imageUrl:
//     "https://velog.velcdn.com/images/chobae/post/9ef630b0-c0f3-462d-a432-0bbc5a8a6e5f/image.png",
// };
const navigation: any[] = [];
// 오른쪽 프로필 메뉴
const userNavigation = [
  { name: "즐겨찾기", href: "" },
  { name: "설정", href: "" },
  {
    name: "로그아웃",
    href: "",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const Headerasd: React.FC = () => {
  // const [bookmark, setBookmark] = useRecoilState(bookmarkState);
  const [mainSectionNum, setMainSectionNum] = useRecoilState(mainSectionState);

  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // const resetFeeds = useResetRecoilState(groupFeedListState);
  // react-query 사용 시 server state
  const {
    data: user,
    isSuccess,
    isLoading,
    error,
  } = useQuery(
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
        // console.log(res.data);
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
    // console.log("bookmark click");
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

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-sky-600">
          {({ open }) => (
            <>
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 ">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    {/* 네브 타이틀 */}
                    <div className="flex items-center flex-shrink-0 mr-6 text-white">
                      <button onClick={handleLogoClick}>
                        <span className="text-xl font-semibold tracking-tight">
                          Highlighters
                        </span>
                      </button>
                    </div>
                    {/* 이부분에서 메뉴 만들어주는듯? */}
                  </div>
                  {/* 검색창 기능 */}
                  {/*일단 뺐는데  lg:max-w-xs 작은사이즈 설정같음 -> 확인하자 */}
                  <div className="w-full max-w-lg lg:max-w-lg">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative text-white focus-within:text-gray-600">
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                        {/* search icon */}
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
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                          />
                        </svg>
                      </div>
                      <input
                        id="search"
                        name="search"
                        className="block w-full py-2 pl-8 pr-3 text-sm text-white placeholder-gray-500 border border-transparent rounded-md bg-sky-600 focus:outline-none focus:placeholder-gray-400 focus:bg-white focus:text-gray-900 focus:border-white focus:ring-0 sm:text-sm"
                        placeholder="Search"
                        type="search"
                      />
                    </div>
                  </div>

                  {/*  오른쪽 프로필 부분 */}
                  <div className="hidden md:block">
                    <div className="flex items-center ml-4 md:ml-6">
                      {/* 홈버튼 or 북마크 버튼  */}
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

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                    onClick={logout}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>

                  {/* 여기 밑부턴 필요없음. */}
                  <div className="flex -mr-2 md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center p-2 text-gray-400 bg-gray-800 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block w-6 h-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block w-6 h-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={
                          isSuccess && user.image
                            ? user.image
                            : "https://via.placeholder.com/150"
                        }
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {/* {user.nickname} */}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {/* {user.email} */}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="flex-shrink-0 p-1 ml-auto text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="w-6 h-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="px-2 mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        onClick={logout}
                        className="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
};
