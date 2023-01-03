// React
import { Fragment, useEffect, useState } from "react";
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

// Recoil -> state management
import { bookmarkState, feedState } from "./states/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

function App() {
  const bookmarkOn = useRecoilValue(bookmarkState);
  const [logged, setLog] = useState(false);

  // 로그인 상태를 확인해서 로그인 상태면 전체적으로 뷰 변경
  const header = logged ? <LoginHeader /> : <Header />;
  
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
  // const [feeds, setFeeds] = useRecoilState(feedState);
  const setFeeds= useSetRecoilState(feedState);
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
        `http://localhost:3001/api/feed/group/${fetchda}`
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
      setFeeds((oldFeeds:any) => [...oldFeeds, newfeed]);
    });
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
      {header}
      {/* <HeaderTest></HeaderTest>
       */}
      {}
      {/* <div className="flex justify-evenly">
       */}
      {/* 로그인 후 메인페이지 */}

      {!logged ? (
        <div className="grid gap-4 xl:px-40 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1">
          <User></User>
          {bookmarkOn ? (
            <AvailableFeeds></AvailableFeeds>
          ) : (
            <AvailableBookmarks></AvailableBookmarks>
          )}
        </div>
      ) : (
        <div className="mt-10">
          <GoogleButton></GoogleButton>
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
