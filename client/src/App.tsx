// React
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
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
import GoogleButtonBack from "./GoogleButtonBack";
// Recoil -> state management
import { bookmarkState, feedState } from "./states/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import GoogleButton from "./GoogleButton";

// clientId
const clientId =
  "1051615347268-qio4ne1nai8flq7felb5h0relc1lcp0b.apps.googleusercontent.com";
function App() {
  const bookmarkOn = useRecoilValue(bookmarkState);
  const [logged, setLog] = useState(false);
  // const navigate = useNavigate();

  // 로그인 상태를 확인해서 로그인 상태면 전체적으로 뷰 변경
  const header = logged ? <LoginHeader /> : <Header />;
  // const [feeds, setFeeds] = useRecoilState(feedState);
  const setFeeds = useSetRecoilState(feedState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  console.log(cookies);
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
      console.log(newfeed);
      // recoil feeds state에 피드 추가
      setFeeds((oldFeeds: any) => [...oldFeeds, newfeed]);
    });
  };

  const logout = () => {
    removeCookie("logCookie");
    // navigate('/');
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
          <button onClick={logout} className="justify-center bg-black" />
        </div>
      ) : (
        <div className="flex justify-center mt-10">
          <div>
            <h1 className="text-2xl font-bold">
              회원가입해서 그룹을 만드세요 !
            </h1>
          </div>
          {/* SignUpButton h1 아래로 보내기 */}
          {/* <GoogleOAuthProvider clientId={clientId}> */}
          <GoogleButtonBack></GoogleButtonBack>
          {/* </GoogleOAuthProvider> */};{/* <SignUpButton></SignUpButton> */}
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
