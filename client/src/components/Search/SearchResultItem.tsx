import { CalendarIcon } from "@heroicons/react/20/solid";
import { searchKeywordState } from "../../states/atom";
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
      '<span style="background-color: #FFEA20">$1</span>'
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
  if (props.searchContent) {
    highlightContent = props.searchContent.map(
      (content: any, index: number) => {
        // #부터 -까지 파싱
        let colorPattern = /#(.*?)-/g;
        let color = colorPattern.exec(content);
        // console.log(color[1])
        let pattern = /<em>(.*?)<\/em>/g;
        let newStr = content.replace(
          pattern,
          '<span style="font-weight:bold; ; opacity:1;">$1</span>'
        );
        return (
          <li key={index}>
            <span className="text-sm text-black opacity-70">
              <span
                
                dangerouslySetInnerHTML={{ __html: newStr }}
                style={{ backgroundColor: color! }}
              ></span>
            </span>
          </li>
        );
      }
    );
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
          <ul className="space-y-1.5">{highlightContent}</ul>
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
