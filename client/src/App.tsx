import { Fragment, useEffect, useState } from "react";
import Feeds from "./components/Feeds/Feeds";
import Cart from "./components/back/Cart/Cart";
import AvailableBookmarks from "./components/Bookmarks/AvailableBookmarks";
// 레이아웃 구상
import HeaderTest from "./components/Layout/Header";
import User from "./components/User/User";
import AvailableFeeds from "./components/Feeds/AvailableFeeds";

import { bookmarkState, feedState } from "./states/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import Feed from "./models/feed";
function App() {
  const bookmarkOn = useRecoilValue(bookmarkState);
  // const showCartHandler = () => {

  // const [cartIsShown, setCartIsShown] = useState(false)
  // const [feedIsShown, setFeedIsShown] = useState(false);
  // const showFeedHandler = () => {
  //   setFeedIsShown(true);
  // };
  // const hideFeedHandler = () => {
  //   setFeedIsShown(false);
  // };
  // const clickB = () => {
  //   const dragnode = window.getSelection();
  //   // drarnode에 포함된 노드들의 엘리먼트를 가져온다

  //   const range = dragnode!.getRangeAt(0);
  //   const rangeArray = range.cloneContents().childNodes;
  //   console.log(rangeArray);
  //   rangeArray.forEach((node) => {
  //     if (node.nodeType === 1) {
  //       const span = document.createElement("span");
  //       span.style.backgroundColor = "yellow";
  //       // span.innerHTML = node.outerHTML;
  //     }
  //   });
  // };
  const [feeds, setFeeds] = useRecoilState(feedState);
  // 바디형식
  // const fetchda = {
  //   'group_id': 1
  // }
  // 파람형식
  const fetchda = 1;
  // 바디형식
  // const fetchda = JSON.stringify({
  //   'group_id': 1
  // })
  // 렌더링된 후 바로 실행
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        `http://localhost:3001/api/feeds/${fetchda}`
      );
      const data = await response.json();
      console.log(data);
      feedadd(data);
    }
    fetchData();
  }, []);

  // 피드리스트에 피드아이템 넣기
  const feedadd = (data: []) => {
    data.map((item: any) => {
      const newfeed = {
        id: item.feed_id,
        title: item.og_title,
        description: item.og_desc,
        highlight: [
          "도커를 사용하면 기존에 개발자들이 환경 설정으로부터 겪던 고충을 말끔히 해결시켜 준다. 사실상 업계 표준이 되어가고 있으니 사용법을 꼭 익히면 좋을 것이다",
          "이건 몰루",
          "도커를 사용하면 기존에 개발자들이 환경 설정으로부터 겪던 고충을 말끔히 해결시켜 준다. 사실상 업계 표준이 되어가고 있으니 사용법을 꼭 익히면 좋을 것이다",
        ],
        Date: item.createdAt,
      };
      console.log(newfeed)
      setFeeds([...feeds, newfeed]);
    });
    console.log(feeds);
  };

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
      <div className="grid gap-4 xl:px-40 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1">
        <User></User>
        {bookmarkOn ? (
          <AvailableFeeds></AvailableFeeds>
        ) : (
          <AvailableBookmarks></AvailableBookmarks>
        )}
      </div>
      {/* <button onClick={getData} className="bg-black">
        클릭
      </button> */}
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
