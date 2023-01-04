// React
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
// Layout
//  header section
import Header from "./components/Layout/Header";
import LoginHeader from "./components/Layout/LoginHeader";
// aside section
import User from "./components/User/User";
// feed & bookmark section
import AvailableFeeds from "./components/Feeds/AvailableFeeds";
import AvailableBookmarks from "./components/Bookmarks/AvailableBookmarks";

// user before login section
// import GoogleButton from "./GoogleButton";
// Recoil -> state management
import {
  bookmarkState,
  feedState,
  logModalVisble,
  sighUpCheck,
} from "./states/atom";
import {
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useResetRecoilState,
} from "recoil";
import LoginModal from "./LoginModal";
import { log } from "console";
import Alert from "./components/Right/Alert";

function App() {
  const bookmarkOn = useRecoilValue(bookmarkState);
  const [loginModalState, setLoginModalState] = useRecoilState(logModalVisble);
  const setFeeds = useSetRecoilState(feedState);
  const [logged, setLog] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // const navigate = useNavigate();

  // 로그인 상태를 확인해서 로그인 상태면 전체적으로 뷰 변경
  const header = !cookies.logCookie ? <LoginHeader /> : <Header />;
  // const [feeds, setFeeds] = useRecoilState(feedState);

  // 파람형식
  const fetchda = 1;
  // 바디형식
  // const fetchda = JSON.stringify({
  //   'group_id': 1
  // })
  // useeffect로 데이터 받아오기
  const loginModalHandler = () => {
    setLoginModalState(!loginModalState);
  };

  return (
    <Fragment>
      {/* {bookmarkState && <Cart onClose={hideCartHandler} />} */}
      {/* <Header onShowCart={showCartHandler}></Header>
       */}
      {header}
      {/* <HeaderTest></HeaderTest>
       */}
      {}
      {/* <div className="flex justify-evenly">
       */}
      {/* 로그인 후 메인페이지 */}

      {cookies.logCookie ? (
        <div className="flex flex-row gap-4 m-8 mx-10 xl:px-40 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1 ">
          <User></User>
          {bookmarkOn ? (
            <AvailableFeeds></AvailableFeeds>
          ) : (
            <AvailableBookmarks></AvailableBookmarks>
          )}
          <Alert></Alert>
        </div>
      ) : (
        <div className="flex justify-center mt-10">
          <div>
            {/* 회원가입 버튼 */}
            <button
              onClick={loginModalHandler}
              className="w-full h-12 px-6 text-indigo-100 transition-colors duration-150 rounded-lg bg-sky-500 focus:shadow-outline hover:bg-sky-800"
            >
              <p className="text-bold">Login</p>
            </button>
          </div>
          {loginModalState && <LoginModal></LoginModal>}
        </div>
      )}
      {/* <div className="grid gap-4 xl:px-40 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1">
        <User></User>
        {bookmarkOn ? (
          <AvailableFeeds></AvailableFeeds>
        ) : (
          <AvailableBookmarks></AvailableBookmarks>
        )}
      </div> */}

      {/* <button onClick={getData} className="bg-black">
        클릭
      </button> */}
    </Fragment>
  );
}
export default App;
