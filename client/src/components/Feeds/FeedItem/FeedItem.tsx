import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  PencilIcon,
} from "@heroicons/react/20/solid";
import {
  ChatBubbleBottomCenterIcon,
  StarIcon as StarIconOutLine,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Comment } from "../../Comment/Comment";
import { FeedTagEdit } from "../../Tags/FeedTagEdit";
import { TagItem } from "../../Tags/TagItem/TagItem";
import {
  currentFeedIdState,
  tagModalVisble,
  commentReloadState,
} from "../../../states/atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Bookmarked } from "../../Bookmarks/BookmarkItem/Bookmarked";
import { UnBookmarked } from "../../Bookmarks/BookmarkItem/UnBookmarked";
import { Delete } from "../../Func/Delete";
import { useGetThree } from "../../../hooks/useGetThree";
import { useCookies } from "react-cookie";

// import AWS from "aws-sdk";
// AWS.config.update({
//   region: "ap-northeast-2",
//   credentials: {
//     accessKeyId: `${process.env.REACT_APP_S3_ACCESS_KEY_ID}`,
//     secretAccessKey: `${process.env.REACT_APP_S3_SECRET_ACCESS_KEY}`,
//   },
// });
import axios from "axios";

const dummary = "현재 네이버 뉴스만 지원합니다 😂";
const FeedItem = (props: any) => {
  const [commentIsClicked, setCommentIsClicked] = useState(false);
  const setCurrentFeedId = useSetRecoilState(currentFeedIdState);
  const [cookies] = useCookies(["logCookie"]);
  const [threeTrigger, setThreeTrigger] = useState(false);
  const [summary, setSummary] = useState(dummary);
  const [commentLen, setCommentLen] = useState(props.commentLen);
  const [isBookmarked, setIsBookmarked] = useState(props.bookmarked);
  // const [img, setImgUrl] = useState("");

  // const [firstHighlight, setFirstHighlight] = useState(
  //   props.highlight[0].user.nickname
  // );
  // 여러개의 하이라이트를 받아서 하나의 리스트로 만들어준다.
  // 하이라이트별 색상 지정해줘야함. -> 수정해야함
  // 날짜 파싱
  const date = new Date(props.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  
  // 원본
  let highlights;
  if (props.highlight.length > 0) {
    let firstHighlight = props.highlight[0].user.nickname;
    highlights = props.highlight.map((hl: any, index: number) => {
      if (firstHighlight !== hl.user.nickname || index === 0) {
        firstHighlight = hl.user.nickname;
        const highContent =
          hl.type === 1 ? (
            <div>
              <span
                className="text-xs lg:text-base"
                style={{ backgroundColor: hl.color }}
              >
                {/* hl.contents에서 개행문자 처리 */}
                {hl.contents.trim()}
                {/* {hl.contents} */}
              </span>
            </div>
          ) : (
            <img
              src={hl.contents}
              className="w-5/6 ml-2 h-5/6 outline-4"
              style={{ outlineStyle: "solid", outlineColor: hl.color }}
            ></img>
          );
        return (
          <div key={index}>
            <li className="" key={index}>
              {" "}
              <div className="flex flex-row mt-4">
                <img
                  src={hl.user.image}
                  className="w-5 h-5 mr-1 rounded-full"
                ></img>
                {highContent}
              </div>
            </li>
          </div>
        );
      }
      return (
        <div key={index}>
          <li className="ml-6 " key={index}>
            {hl.type === 1 ? (
              <span
                className="text-xs lg:text-base"
                style={{ backgroundColor: hl.color }}
              >
                {hl.contents.trim()}
              </span>
            ) : (
              <img
                src={hl.contents}
                className="w-5/6 ml-2 h-5/6 outline-4"
                style={{ outlineStyle: "solid", outlineColor: hl.color }}
              ></img>
            )}
          </li>
        </div>
      );
    });
  }

  // 태그 파싱
  const tags = props.tag.map((tagItem: any, index: number) => (
    <li key={index}>
      <TagItem name={tagItem.tag_name} tag_id={tagItem.id}></TagItem>
    </li>
  ));

  function commentToggleHandler() {
    if (!commentIsClicked) {
      setCurrentFeedId(props.id);
    }
    setCommentIsClicked(!commentIsClicked);
  }

  // useEffect(() => {

  // }, []);

  // 세줄요약 api
  const threeTriHandler = async () => {
    if (!threeTrigger && props.url.includes("https://n.news.naver.com")) {
      // console.log("여기옴?", props.url);
      const three = await axios({
        method: "post",
        url: `${process.env.REACT_APP_HOST}/api/summary`,
        data: {
          url: props.url,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      // console.log(three.data.data.summary);
      setSummary(three.data.data.summary);
    }
    setThreeTrigger(!threeTrigger);
  };

  // 북마크 콜백
  const bookmarkCallback = () => {
    setIsBookmarked(!isBookmarked);
  };
  // 댓글 수 콜백
  const commentCountCallback = (action: any) => {
    if (action === "add") {
      setCommentLen(commentLen + 1);
    } else if (action === "del") {
      setCommentLen(commentLen - 1);
    }
  };
  return (
    // <li className="py-5">
    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
      <div className="flex justify-between">
        <div className="flex flex-row items-center px-3 mt-3 text-xs text-gray-500 xl:text-sm ">
          <Delete feedId={props.id}></Delete>
          <CalendarIcon
            className="mr-1.5 h-3 w-3 xl:h-5 xl:w-5 flex-shrink-0 text-gray-400 "
            aria-hidden="true"
          />
          {`${month}월 ${day}일, ${year}년 `}
        </div>

        <div className="flex flex-row items-center px-3 mt-3 mr-1 text-sm text-gray-500 ">
          <div className="text-xs">{props.writer}</div>
          <div>
            <img
              className="object-cover w-5 h-5 ml-1 rounded-full border-circle "
              src={props.writerImg}
              alt="../../assets/highlighters.png"
            />
          </div>
        </div>
      </div>
      <div className="m-5 sm:px-6">
        <a href={props.url} target="_blank" rel="noreferrer">
          <span>
            <h2 className="mb-5 font-bold leading-6 text-gray-900 text-mg xl:text-xl hover:text-gray-600">
              {props.title}
            </h2>
          </span>
        </a>
        {/* 세줄요약 -> 현재 네이버 뉴스만 가능 */}
        {props.url.includes("https://n.news.naver.com") && (
          <span
            onClick={threeTriHandler}
            className="text-sm font-bold text-gray-500 cursor-pointer hover:text-gray-700"
          >
            <span className="mr-1 text-xl">🤖</span> "3줄로 요약해줘"
          </span>
        )}
        <div className="">
          {threeTrigger &&
            summary.split("\n").map((line, index) => (
              <div
                className="mt-1 text-sm font-bold ml-7 text-sky-400 animate-fade-in-down"
                key={index}
              >
                {index + 1}. {line} <br />
              </div>
            ))}
        </div>
        <div className="mb-5 ">
          <ul className="space-y-0.5">{highlights}</ul>
        </div>

        {/* 노션 북마크처럼 만들기 프로젝트 */}
        <a href={props.url} target="_blank" rel="noreferrer">
          <div className="flex w-5/6 h-20 mb-2 overflow-hidden rounded-lg shadow-sm cursor-pointer">
            <div className="w-20 h-full">
              <img
                className="object-cover w-full h-full rounded-sm"
                src={props.og_image}
                alt=""
              />
            </div>
            <div className="flex-1 px-6 py-3 mb-4">
              <h4 className="mb-2 text-sm font-semibold tracking-tight text-gray-700">
                {props.title}
              </h4>
              <p className="text-xs leading-normal text-gray-500 textTruncate">
                {props.description.substring(0, 70)}...
              </p>
            </div>
          </div>
        </a>
        {/* 태그 section */}
        <div className="flex flex-wrap mt-2">{tags}</div>
        {/* 태그 수정 section */}
        <div className="flex items-center justify-between mt-4 ml-2 text-sm text-gray-500 ">
          <FeedTagEdit
            // key={props.key}
            tag={props.tag}
            feed_id={props.id}
          ></FeedTagEdit>

          {/* 댓글 , 즐겨찾기 section*/}
          <div>
            <div className="flex flex-row">
              {" "}
              {/* 즐겨찾기 section */}
              {!isBookmarked ? (
                <Bookmarked onFunc={bookmarkCallback} feedId={props.id} />
              ) : (
                <UnBookmarked
                  onFunc={bookmarkCallback}
                  bookmarkId={props.bookmarkId}
                ></UnBookmarked>
              )}
              {/* 댓글 길이 */}
              <span className="ml-5 mr-1">{commentLen}</span>
              <button onClick={commentToggleHandler} className="">
                {/* <button className=""> */}
                <ChatBubbleBottomCenterIcon className="w-5 h-5 text-gray-400 hover:text-gray-700 " />
                {/* </button> */}
                {/* ChevronDownIcon 클릭시 댓글창  */}
                {/* */}
              </button>
            </div>
          </div>
        </div>
        {/* 숨김 코멘트창 */}
        {commentIsClicked && (
          <Comment
            onFunc={commentCountCallback}
            reset={commentIsClicked}
          ></Comment>
        )}
      </div>
    </div>
    // </li>
  );
};

export default FeedItem;
