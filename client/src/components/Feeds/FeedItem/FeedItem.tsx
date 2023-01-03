import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";

const FeedItem = (props: any) => {
  // 여러개의 하이라이트를 받아서 하나의 리스트로 만들어준다.
  // 하이라이트별 색상 지정해줘야함. -> 수정해야함
  let font_color = "text-sky-500";
  // 날짜 파싱
  const date = new Date(props.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  
  // if (props.text.length > 1) {
  //   const highlights = props.text.map((hl: string) => (
  //     <li className={font_color}>{hl}</li>
  //   ));
  // }

  return (
    <Fragment>
      <li className="py-5" key={props}>
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="flex flex-row-reverse items-center px-3 mt-2 text-sm text-gray-500">
            <CalendarIcon
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 "
              aria-hidden="true"
            />
            {`${month}월 ${day}일, ${year}년 `}
          </div>

          <div className="px-4 py-5 sm:px-6">
            <a href={props.url} target="_blank" rel="noreferrer">
              <h2 className="text-lg font-medium leading-6 text-gray-900">
                {props.title}
              </h2>
            </a>
            <p className="max-w-2xl mt-1 text-sm text-gray-500">
              {props.description}
            </p>
            {/* <p >
            <span className="text-sm font-medium bg-sky-500"> {props.text}</span> 
          </p> */}
            {/* 다수의 하이라이팅 표시 -> 수정해야할듯?*/}
            {/* 
            <div>
              <ul>{highlights}</ul>
            </div> */}

            {/* 태그 */}
            <div className="flex flex-wrap mt-2">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
                #오늘도 또 야근 사장님 죽어
              </span>
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
                #도커
              </span>
            </div>

            {/* 댓글 기능 */}
            <div className="flex flex-row-reverse items-center px-3 mt-2 text-sm text-gray-500">
              {/* 즐겨찾기 */}
              <CheckIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 hover:text-sky-500"
                aria-hidden="true"
              />
              즐겨찾기
              {/* 댓글 */}
              <PencilIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 "
                aria-hidden="true"
              />
              <ChevronDownIcon
                className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 "
                aria-hidden="true"
              />
              댓글 9
            </div>
          </div>
        </div>
      </li>
    </Fragment>
  );
};

export default FeedItem;
