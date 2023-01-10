// React
import { Fragment } from "react";
import { useCookies } from "react-cookie";
// Layout
//  header section
import Header from "./components/Layout/Header";
import LoginHeader from "./components/Layout/LoginHeader";
// aside section
import User from "./components/User/User";
// feed & bookmark section
import AvailableFeeds from "./components/Feeds/AvailableFeeds";
import AvailableBookmarks from "./components/Bookmarks/AvailableBookmarks";
import AvailableTags from "./components/Tags/AvailableTags";
// user before login section
import LoginModal from "./components/Intro/LoginModal";
import Alert from "./components/Right/Noti";
import Intro from "./components/Intro/Intro";
// state management section
import { useRecoilValue } from "recoil";
import {
  bookmarkState,
  logModalVisble,
  tagState,
  userInfo,
  feedViewState,
} from "./states/atom";
import { useEffect, useState } from "react";
import { Main } from "./components/Main/Main";
function App() {
  const tagOn = useRecoilValue(tagState);
  const bookmarkOn = useRecoilValue(bookmarkState);
  const groupFeedOn = useRecoilValue(feedViewState);

  const loginModalState = useRecoilValue(logModalVisble);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // 유저정보의 변화가 있을때만 리렌더링
  const userData = useRecoilValue(userInfo);
  const [localUser, setLocalUser] = useState(userData);
  useEffect(() => {
    setLocalUser(userData);
  }, [userData]);
  // const userData = useRecoilValue(userInfo);
  // 로그인 상태를 확인해서 로그인 상태면 전체적으로 뷰 변경
  const header = !cookies.logCookie ? <LoginHeader /> : <Header />;
  // // const logedMain = bookmarkOn ? (
  // //   <AvailableFeeds></AvailableFeeds>
  // // ) : (
  // //   <AvailableBookmarks></AvailableBookmarks>
  // // );
  // (bookmarkOn && <AvailableFeeds></AvailableFeeds>)(
  //   !bookmarkOn && <AvailableTags></AvailableTags>
  // );

  return (
    <Fragment>
      {/* header section */}
      {header}
      {/* log section */}
      {/* loged main section*/}
      {cookies.logCookie ? (
        <Main></Main>
      ) : (
        // log section
        <div className="">
          <div>
            <Intro></Intro>
          </div>
          {/* log modal*/}
          {loginModalState && <LoginModal></LoginModal>}
        </div>
      )}
    </Fragment>
  );
}
export default App;
