import { Fragment, useState } from "react";
import Feeds from "./components/Feeds/Feeds";
import Cart from "./components/back/Cart/Cart";
import AvailableBookmarks from "./components/Bookmarks/AvailableBookmarks";
// 레이아웃 구상
import HeaderTest from "./components/Layout/Header";
import User from "./components/User/User";
import AvailableFeeds from "./components/Feeds/AvailableFeeds";
import Alert from "./components/Right/Alert";
import { bookmarkState } from "./states/atom";
import { useRecoilValue } from "recoil";
function App() {
  const bookmarkOn = useRecoilValue(bookmarkState);
  // // 모달 밑 장바구니 온오프
  // const [cartIsShown, setCartIsShown] = useState(false);
  // const showCartHandler = () => {
  //   setCartIsShown(true);
  // };
  // const hideCartHandler = () => {
  //   setCartIsShown(false);
  // };
  // 피드 밑 북마크 온오프
  // const [feedIsShown, setFeedIsShown] = useState(false);
  // const showFeedHandler = () => {
  //   setFeedIsShown(true);
  // };
  // const hideFeedHandler = () => {
  //   setFeedIsShown(false);
  // };

  return (
    <Fragment>
      {/* {bookmarkState && <Cart onClose={hideCartHandler} />} */}
      {/* <Header onShowCart={showCartHandler}></Header>
       */}
      <HeaderTest></HeaderTest>
      {}
      {/* <div className="flex justify-evenly">
       */}
      <div className="grid grid-cols-3 gap-4">
        <User></User>
        {bookmarkOn ? (
          <AvailableFeeds></AvailableFeeds>
        ) : (
          <AvailableBookmarks></AvailableBookmarks>
        )}
        {/* <AvailableFeeds></AvailableFeeds> */}
        {/* <Alert></Alert> */}
      </div>
      {/* <Meals></Meals> */}
    </Fragment>
  );
}
export default App;
