import { PaperClipIcon } from "@heroicons/react/20/solid";
import BookmarkItem from "./BookmarkItem/BookmarkItem";
const AvailableBookmarks = () => {
  const DUMMY_Feeds = [
    {
      id: "m1",
      title: "이건 북마크꺼 도커(Docker)를 사용하는 이유는 무엇일까?",
      description: "이것좀 봐봐 도커가 이거래",
      highlight: [
        "도커를 사용하면 기존에 개발자들이 환경 설정으로부터 겪던 고충을 말끔히 해결시켜 준다. 사실상 업계 표준이 되어가고 있으니 사용법을 꼭 익히면 좋을 것이다",
        "하이라이팅 효과",
        "하이라이팅 효과",
      ],
      Date: "2022-12-30 12:00",
    },
    {
      id: "m2",
      title: "피드 이름 2",
      description: "유저 코멘트?",
      highlight: ["하이라이팅 효과", "하이라이팅 효과", "하이라이팅 효과"],
      Date: "2022-12-31 12:21",
    },
    {
      id: "m3",
      title: "피드 이름 3",
      description: "유저 코멘트?",
      highlight: ["하이라이팅 효과", "하이라이팅 효과", "하이라이팅 효과"],
      Date: "2023-01-01 04:52",
    },
    {
      id: "m4",
      title: "피드 이름 4",
      description: "유저 코멘트?",
      highlight: ["하이라이팅 효과", "하이라이팅 효과", "하이라이팅 효과"],

      Date: "2023-01-02 03:12",
    },
    {
      id: "m4",
      title: "피드 이름 5",
      description: "유저 코멘트?",
      highlight: ["하이라이팅 효과", "하이라이팅 효과", "하이라이팅 효과"],

      Date: "2023-01-02 03:12",
    },
    {
      id: "m4",
      title: "피드 이름 6",
      description: "유저 코멘트?",
      highlight: ["하이라이팅 효과", "하이라이팅 효과", "하이라이팅 효과"],

      Date: "2023-01-02 03:12",
    },
  ];

  const feedsList = DUMMY_Feeds.map((feed) => (
    <BookmarkItem
      id={feed.id}
      key={feed.id}
      title={feed.title}
      description={feed.description}
      text={feed.highlight}
      date={feed.Date}
    />
  ));
  return (
    <div className="h-12 overscroll-auto basis-2/4">
      {/* 위에 여백 두고 그룹피드 타이틀 만들기 */}
      {/* 그룹 피드 타이틀 */}
      <div className="relative p-3 rounded-3xl">
        <h1 className="text-2xl antialiased font-bold text-whtie">
          {" "}
          북마크
        </h1>
      </div>
      <div className="">
        <ul className="">{feedsList}</ul>
      </div>
    </div>
  );
};
export default AvailableBookmarks;

// 흰색 박스
// <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//   <dt className="text-sm font-medium text-gray-500">Attachments</dt>
//   <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0"></dd>
// </div>;

// 반대 박스
// <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
//   <dt className="text-sm font-medium text-gray-500">About</dt>
//   <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
//     Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
//     incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
//     consequat sint. Sit id mollit nulla mollit nostrud in ea officia
//     proident. Irure nostrud pariatur mollit ad adipisicing
//     reprehenderit deserunt qui eu.
//   </dd>
// </div>;
