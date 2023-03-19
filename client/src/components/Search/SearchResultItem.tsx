import { CalendarIcon } from "@heroicons/react/20/solid";
import { searchKeywordState } from "../../atoms/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { preProcessFile } from "typescript";

const SearchResultItem = (props: any) => {
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);
  // console.log("잉", props.date);
  const date = new Date(props.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let highlightContent;
  console.log("props", props);
  // 타이틀에 검색어 들어있는지 검사
  let titleContent;
  // const title = props.searchTitle ? props.searchTitle : props.title;
  if (props.searchTitle && props.searchTitle[0]) {
    // <em> 태그 찾아서 파싱한 곳에 span 태그로 감싸고 Span 태그에 className 추가
    let pattern = /<em>(.*?)<\/em>/g;
    let newStr = props.searchTitle[0].replace(
      pattern,
      '<span style="font-weight:bold; color:#0284c7;">$1</span>'
    );
    titleContent = (
      <span
        className="text-lg font-bold text-black"
        dangerouslySetInnerHTML={{ __html: newStr }}
      ></span>
    );
  } else {
    titleContent = (
      <span className="text-lg font-bold text-black">{props.title}</span>
    );
  }
  // 검색어가 포함된 피드 내용
  let color: string;
  let colorPattern = /#[a-z0-9]{6}-/;
  // const match = input.match(pattern);
  // console.log(match[0]); // "#bbf7d0-"
  // 엘라스틱 ver
  // if (props.searchContent) {
  //   highlightContent = props.searchContent.map(
  //     (content: any, index: number) => {
  //       // #부터 -까지 파싱
  //       let match = content.match(colorPattern);
  //       if (match === null) {
  //         return;
  //       }
  //       let newColor = match[0].slice(0, 7);
  //       // console.log("color", newColor, content);
  //       if (newColor === null) {
  //         if (content === "undefined") {
  //           return;
  //         }

  //         let pattern = /<em>(.*?)<\/em>/g;
  //         let newStr = content.replace(
  //           pattern,
  //           '<span style="font-weight:bold; color:#0284c7;">$1</span>'
  //         );
  //         // console.log("newStr", newStr);
  //         return (
  //           <li key={index}>
  //             <span className="text-sm text-black ">
  //               <span
  //                 dangerouslySetInnerHTML={{ __html: newStr }}
  //                 style={{ backgroundColor: `#${color!}` }}
  //               ></span>
  //             </span>
  //           </li>
  //         );
  //       } else {
  //         color = newColor;
  //         // console.log("컬러 있을떄", color);
  //         // 첫번째 공백 부터 시작하기
  //         let newContent = content.split("-").slice(1).join(" ");
  //         if (newContent === "undefined") {
  //           return;
  //         } else if (newContent.length > 100) {
  //           newContent = newContent.slice(0, 100) + "...";
  //         }

  //         let pattern = /<em>(.*?)<\/em>/g;
  //         let newStr = newContent.replace(
  //           pattern,
  //           '<span style="font-weight:bold; color:#0284c7;">$1</span>'
  //         );
  //         // console.log("newStr", newStr);
  //         return (
  //           <li key={index}>
  //             <span className="text-sm text-black ">
  //               <span
  //                 dangerouslySetInnerHTML={{ __html: newStr }}
  //                 style={{ backgroundColor: `${color!}` }}
  //               ></span>
  //             </span>
  //           </li>
  //         );
  //       }
  //     }
  //   );
  // }
  // 일반 검색용
  if (props.resultinfo.length > 0) {
    highlightContent = props.resultinfo.map((content: any, index: number) => {
      return (
        <li key={index}>
          <span
            className="text-sm text-black "
            style={{ backgroundColor: `${content.highlight.color!}` }}
          >
            {content.highlight.contents.slice(0, 100)}
          </span>
        </li>
      );
    });

    // #부터 -까지 파싱
  }
  return (
    // <li className="py-5">
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="flex justify-between">
        <div className="flex flex-row items-center px-3 mt-3 text-xs text-gray-500 xl:text-sm ">
          {/* <Delete feedId={props.id}></Delete> */}
          {/* 피드 생성일 */}
          <CalendarIcon
            className="mr-1.5 h-3 w-3 xl:h-5 xl:w-5 flex-shrink-0 text-gray-400 "
            aria-hidden="true"
          />
          {`${month}월 ${day}일, ${year}년 `}
        </div>
        {/* 피드 작성자 */}
        <div className="flex flex-row items-center px-3 mt-3 mr-1 text-sm text-gray-500 ">
          <div className="text-xs">{props.writer}</div>
          <div>
            <img
              className="object-cover w-5 h-5 ml-1 rounded-full border-circle "
              src={props.writerImage}
              alt="../../assets/highlighters.png"
            />
          </div>
        </div>
      </div>
      <div className="m-5 sm:px-6">
        {/* 피드 제목 */}
        <a href={props.url} target="_blank" rel="noreferrer">
          <span>
            <h2 className="mb-5 font-bold leading-6 text-gray-900 text-mg xl:text-xl hover:text-gray-600">
              {titleContent}
            </h2>
          </span>
        </a>
        {/* 검색어가 포함된 피드 내용 */}
        <div className="mb-5 ">
          <ul className="">
            {highlightContent !== undefined && highlightContent}
          </ul>
        </div>
        <div className="flex items-center justify-between mt-4 ml-2 text-sm text-gray-500 ">
          <div>
            <div className="flex flex-row space-x-5"></div>
          </div>
        </div>
      </div>
    </div>
    // </li>
  );
};

export default SearchResultItem;
