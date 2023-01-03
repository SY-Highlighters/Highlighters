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
import GoogleButton from "./GoogleButton";
import SignUpButton from "./SignUpButton";
// Recoil -> state management
import { bookmarkState, feedState } from "./states/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

function App() {
  const bookmarkOn = useRecoilValue(bookmarkState);
  const [logged, setLog] = useState(false);

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
        title: item.og_title,
        description: item.og_desc,
        // highlight: [
        //   "도커를 사용하면 기존에 개발자들이 환경 설정으로부터 겪던 고충을 말끔히 해결시켜 준다. 사실상 업계 표준이 되어가고 있으니 사용법을 꼭 익히면 좋을 것이다",
        //   "이건 몰루",
        //   "도커를 사용하면 기존에 개발자들이 환경 설정으로부터 겪던 고충을 말끔히 해결시켜 준다. 사실상 업계 표준이 되어가고 있으니 사용법을 꼭 익히면 좋을 것이다",
        // ],
        Date: item.createdAt,
      };
      console.log(newfeed);
      // recoil feeds state에 피드 추가
      setFeeds((oldFeeds: any) => [...oldFeeds, newfeed]);
    });
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
            <h1 className="text-2xl font-bold">
              회원가입해서 그룹을 만드세요 !
            </h1>
          </div>
          {/* SignUpButton h1 아래로 보내기 */}
          <GoogleButton></GoogleButton>
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
