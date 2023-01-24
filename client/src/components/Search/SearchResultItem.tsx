import { CalendarIcon } from "@heroicons/react/20/solid";
import { searchKeywordState } from "../../states/atom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const SearchResultItem = (props: any) => {
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);
  // console.log("잉", props.date);
  const date = new Date(props.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let titleDiv;
  let resultinfosDiv;

  // 타이틀에 검색어 들어있는지 검사
  const title = props.title;
  const i = title.toUpperCase().indexOf(searchKeyword.toUpperCase());
  if (i !== -1) {
    const j = i + searchKeyword.length;
    titleDiv = (
      <div>
        {title.substring(0, i)}
        <span className="text-sky-600">{title.substring(i, j)}</span>
        {title.substring(j)}
      </div>
    );
  } else {
    titleDiv = <div>{title}</div>;
  }

  // 하이라이트에 검색어 들어있는지 검사
  if (props.resultinfo.length > 0) {
    resultinfosDiv = props.resultinfo.map((info: any, index: number) => {
      if (info === "") {
        return;
      }
      let infoContent;
      switch (info.type) {
        case 1:
          const content = info.highlight.contents;
          if (content.length < 200) {
            infoContent = (
              <span style={{ backgroundColor: info.highlight.color }}>
                {content.substring(0, info.includeStart)}
                <span className="font-bold text-sky-600">
                  {content.substring(info.includeStart, info.includeEnd)}
                </span>
                {content.substring(info.includeEnd)}
              </span>
            );
          } else {
            if (content.length - info.includeEnd < 200)
              infoContent = (
                <span style={{ backgroundColor: info.highlight.color }}>
                  {"..."}
                  <span className="font-bold text-sky-600">
                    {content.substring(info.includeStart, info.includeEnd)}
                  </span>
                  {content.substring(info.includeEnd)}
                </span>
              );
            else {
              infoContent = (
                <span style={{ backgroundColor: info.highlight.color }}>
                  {"..."}
                  <span className="font-bold text-sky-600">
                    {content.substring(info.includeStart, info.includeEnd)}
                  </span>
                  {content.substr(info.includeEnd, 200) + "..."}
                </span>
              );
            }
          }
          break;
        default:
          console.log("error");
          infoContent = "error";
          break;
      }
      return <div>{infoContent}</div>;
    });
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
              {titleDiv}
            </h2>
          </span>
        </a>
        {/* 검색어가 포함된 피드 내용 */}
        <div className="mb-5 ">
          <ul className="space-y-1.5">{resultinfosDiv}</ul>
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
