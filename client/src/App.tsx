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
// user before login section
import LoginModal from "./components/Intro/LoginModal";
import Alert from "./components/Right/Alert";
import Intro from "./components/Intro/Intro";
// state management section
import { useRecoilValue } from "recoil";
import { bookmarkState, logModalVisble } from "./states/atom";

function App() {
  const bookmarkOn = useRecoilValue(bookmarkState);
  const loginModalState = useRecoilValue(logModalVisble);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  // 로그인 상태를 확인해서 로그인 상태면 전체적으로 뷰 변경
  const header = !cookies.logCookie ? <LoginHeader /> : <Header />;

  return (
    <Fragment>
      {/* header section */}
      {header}
      {/* log section */}
      {/* loged main section*/}
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
