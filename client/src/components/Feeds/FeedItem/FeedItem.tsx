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
  let font_color = "bg-yellow-200";
  // 날짜 파싱
  const date = new Date(props.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 하이라이트 파싱
  const highlights = props.text.map((hl: any) => (
    <li className="">
      <span className={font_color}>{hl.contents}</span>
    </li>
  ));

  return (
    <li className="py-5">
      <div className="overflow-hidden bg-white rounded-lg shadow">
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
          {/* <p >
            <span className="text-sm font-medium bg-sky-500"> {props.text}</span> 
          </p> */}
          {/* 다수의 하이라이팅 표시 -> 수정해야할듯?*/}

          <div>
            <ul>{highlights}</ul>
          </div>

          {/* 노션 북마크처럼 만들기 프로젝트 */}
          <div className="max-w-lg overflow-hidden rounded-lg shadow-lg w-50 sm:flex">
            <div className="w-full sm:w-1/3">
              <img
                className="object-cover w-full h-48"
                src={props.og_image}
                alt="Flower and sky"
              />
            </div>
            <div className="flex-1 px-6 py-4">
              <h4 className="mb-3 text-xl font-semibold tracking-tight text-gray-800">
                {props.title}
              </h4>
              <p className="leading-normal text-gray-700">
                {props.description}
              </p>
            </div>
          </div>
          {/* 태그 */}
          <div className="flex flex-wrap mt-2">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
              #야 너 아직 Highlighters 몰라?
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
  );
};

export default FeedItem;
