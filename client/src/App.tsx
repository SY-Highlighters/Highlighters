import { Fragment, useState } from "react";
import Feeds from "./components/Feeds/Feeds";
import Cart from "./components/back/Cart/Cart";
import AvailableBookmarks from "./components/Bookmarks/AvailableBookmarks";
// 레이아웃 구상
import HeaderTest from "./components/Layout/HeaderTest";
import User from "./components/User/User";
import AvailableFeeds from "./components/Feeds/AvailableFeeds";
import Alert from "./components/Right/Alert";
import { bookmarkState } from "./states/atom";
import { useRecoilValue } from "recoil";
function App() {
  const bookmarkOn = useRecoilValue(bookmarkState);

  const [feedIsShown, setFeedIsShown] = useState(false);
  const showFeedHandler = () => {
    setFeedIsShown(true);
  };
  const hideFeedHandler = () => {
    setFeedIsShown(false);
  };
  const clickB = () => {
    const dragnode = window.getSelection();
    // drarnode에 포함된 노드들의 엘리먼트를 가져온다

    const range = dragnode!.getRangeAt(0);
    const rangeArray = range.cloneContents().childNodes;
    console.log(rangeArray);
    rangeArray.forEach((node) => {
      if (node.nodeType === 1) {
        const span = document.createElement("span");
        span.style.backgroundColor = "yellow";
        // span.innerHTML = node.outerHTML;
      }
    });
  };
    const getData =() => {
      try {
        const data = fetch("http://localhost:3001/api/feeds/1")
          .then((res) => res.json())
          .then((data) => console.log(data));
        return data;
      } catch (err) {
        console.log(err);
      }
    }
    // const span = document.createElement("span");
    //   span.style.backgroundColor = "yellow";
    //   span.innerHTML = node.outerHTML;
    //   range.surroundContents(span);

    // console.log(dragnode);
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
        {/* <Alert></Alert> */}
      </div>
      {/*<Meals></Meals>  */}
      <button onClick={getData} className="bg-black">클릭</button>
    </Fragment>
    // // 하이라이트 테스트
    // <div>
    //   <h1>이건 테스트1</h1>
    //   <h2>이건 테스트2</h2>
    //   <h3>이건 테스트3</h3>
    //   <h4>이건 테스트4</h4>
    //   <button onClick={clickB}>클릭</button>
    // </div>
  );
}
export default App;
