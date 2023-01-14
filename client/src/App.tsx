// React
import { useEffect, useState, Fragment } from "react";
import { useCookies } from "react-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Layout
//  header section
import Header from "./components/Layout/Header";
import LoginHeader from "./components/Layout/LoginHeader";
// aside section
// main section
import { Main } from "./components/Main/Main";
// user before login section
import Intro from "./components/Intro/Intro";
import LoginModal from "./components/Intro/LoginModal";
// state management section
import { useRecoilValue } from "recoil";
import { logModalVisble, userInfoState } from "./states/atom";
const clientId =
  "1051615347268-qio4ne1nai8flq7felb5h0relc1lcp0b.apps.googleusercontent.com";
function App() {
  const loginModalState = useRecoilValue(logModalVisble);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  // 유저정보의 변화가 있을때만 리렌더링
  // const userData = useRecoilValue(userInfo);
  // const [localUser, setLocalUser] = useState(userData);
  // useEffect(() => {
  //   setLocalUser(userData);
  // }, [userData]);
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
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col h-screen">
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
      </div>
    </GoogleOAuthProvider>
  );
}
export default App;
