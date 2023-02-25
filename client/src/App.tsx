// React
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

function App() {
  const loginModalState = useRecoilValue(logModalVisble);
  const [cookies] = useCookies(["logCookie"]);

  // 로그인 상태를 확인해서 로그인 상태면 전체적으로 뷰 변경
  const header = !cookies.logCookie ? <LoginHeader /> : <Header />;

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <div className="flex flex-col xl:h-screen">
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
