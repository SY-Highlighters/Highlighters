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

function App() {
  const bookmarkOn = useRecoilValue(bookmarkState);
  const [loginModalState, setLoginModalState] = useRecoilState(logModalVisble);
  const [logged, setLog] = useState(false);
  // const navigate = useNavigate();

  // 로그인 상태를 확인해서 로그인 상태면 전체적으로 뷰 변경
  const header = logged ? <LoginHeader /> : <Header />;
  // const [feeds, setFeeds] = useRecoilState(feedState);
  const setFeeds = useSetRecoilState(feedState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  // 파람형식
  const fetchda = 1;
  // 바디형식
  // const fetchda = JSON.stringify({
  //   'group_id': 1
  // })

  // 렌더링된 후 바로 실행
  useEffect(() => {
    async function fetchData() {
      // const response = await fetgch(
      //   `http://localhost:3001/api/feed/group/${fetchda}`
      // );
      // const data = await response.json();
      // console.log(data);
      const response = await axios({
        method: "get",
        url: `http://localhost:3001/api/feed/group/${fetchda}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });

      const data = response.data;
      console.log(data);
      feedadd(data);
    }
    fetchData();
  }, []);

  // 피드리스트에 피드아이템 넣기
  const feedadd = (data: []) => {
    data.map((item: any) => {
      const newfeed = {
        id: item.id,
        url: item.url,
        og_image: item.og_image,
        title: item.og_title,
        description: item.og_desc,
        highlight: item.highlight,
        Date: item.createdAt,
      };
      // recoil feeds state에 피드 추가
      setFeeds((oldFeeds: any) => [...oldFeeds, newfeed]);
    });
  };

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
        <div className="grid gap-4 xl:px-40 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1">
          <User></User>
          {bookmarkOn ? (
            <AvailableFeeds></AvailableFeeds>
          ) : (
            <AvailableBookmarks></AvailableBookmarks>
          )}
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
          {/* SignUpButton h1 아래로 보내기 */}
          {/* <GoogleOAuthProvider clientId={clientId}> */}
          {/* <GoogleButtonBack></GoogleButtonBack> */}
          {loginModalState && <LoginModal></LoginModal>}
          {/* </GoogleOAuthProvider> */}
          {/* <SignUpButton></SignUpButton> */}
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
