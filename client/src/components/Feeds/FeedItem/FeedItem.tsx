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
import LazyImage from "../../Main/LazyImage";
import { StarIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Comment } from "../../Comment/Comment";
import { FeedTagEdit } from "../../Tags/FeedTagEdit";
import { TagItem } from "../../Tags/TagItem/TagItem";
import {
  currentFeedState,
  tagModalVisble,
  commentReloadState,
} from "../../../atoms/atom";
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
import YoutubeTimeStamp from "./YoutubeTimeStamp";
import ThreeLineSummary from "../../summary/ThreeLineSummary";

const dummary = "현재 네이버 뉴스만 지원합니다 😂";
const FeedItem = (props: any) => {
  const [commentIsClicked, setCommentIsClicked] = useState(false);
  const setCurrentFeedId = useSetRecoilState(currentFeedState);
  const [cookies] = useCookies(["logCookie"]);
  const [threeTrigger, setThreeTrigger] = useState(false);
  const [summary, setSummary] = useState(dummary);
  const [commentLen, setCommentLen] = useState(props.commentLen);
  const [isBookmarked, setIsBookmarked] = useState(props.bookmarked);
  const [youtubeTime, setYoutubeTime] = useState("");
  const [isYoutube, setIsYoutube] = useState(false);
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
  const youtubeTimeSet = (time: any) => {
    setYoutubeTime(time);
  };
  // 하이라이트 section
  let highlights;
  let youtubeCode;
  if (props.highlight.length > 0) {
    let firstHighlight = props.highlight[0].user.nickname;

    highlights = props.highlight.map((hl: any, index: number) => {
      // 하이라이트 색상 없을때 -> 하이라이트 안함
      if (hl.color === "-1") {
        return <></>;
      }
      if (hl.type === 3 && index === 0) {
        hl.contents = hl.contents.split(".")[0];
        youtubeCode = props.url.split("v=")[1];
      }
      if (firstHighlight !== hl.user.nickname || index === 0) {
        // 첫 하이라이트
        firstHighlight = hl.user.nickname;
        switch (hl.type) {
          case 1: // 텍스트 하이라이트
            return (
              <div key={index}>
                <li key={index} className="">
                  <div className="flex flex-row mt-2">
                    <img
                      src={hl.user.image}
                      className="w-5 h-5 mr-1 rounded-full shadow-md"
                      alt="유저"
                    ></img>
                    <div className="ml-1">
                      <span
                        className="text-xs lg:text-base"
                        style={{ backgroundColor: hl.color }}
                      >
                        {hl.contents.trim()}
                      </span>
                    </div>
                  </div>
                </li>
              </div>
            );
          case 2: // 이미지 하이라이트
            return (
              <div key={index}>
                <li key={index} className="">
                  <div className="flex flex-row mt-2">
                    <img
                      src={hl.user.image}
                      className="w-5 h-5 mr-1 rounded-full shadow-md"
                      alt="유저"
                    ></img>
                    <img
                      src={hl.contents}
                      className="w-3/5 mt-2 mb-1 ml-2 h-3/5 outline-4"
                      style={{ outlineStyle: "solid", outlineColor: hl.color }}
                      alt="이미지 하이라이트"
                    ></img>
                  </div>
                </li>
              </div>
            );
          case 3: // 동영상 하이라이트
            return (
              <>
                <div></div>
                <div className="inline-flex ml-1 mr-1" key={index}>
                  <li key={index}>
                    <div className="flex flex-row mt-2">
                      <img
                        src={hl.user.image}
                        className="w-5 h-5 mr-2 rounded-full shadow-md"
                        alt="유저"
                      ></img>
                      <YoutubeTimeStamp
                        time={hl.contents}
                        setTime={youtubeTimeSet}
                      ></YoutubeTimeStamp>
                    </div>
                  </li>
                </div>
              </>
            );
          default:
        }
      } else {
        // 첫 하이라이트 아닐 때
        switch (hl.type) {
          case 1: // 텍스트 하이라이트
            return (
              <div key={index}>
                <li key={index} className="ml-6 ">
                  <div className="ml-1">
                    <span
                      className="text-xs lg:text-base"
                      style={{ backgroundColor: hl.color }}
                    >
                      {hl.contents.trim()}
                    </span>
                  </div>
                </li>
              </div>
            );
          case 2: // 이미지 하이라이트
            return (
              <div key={index}>
                <li key={index} className="ml-6 ">
                  <img
                    src={hl.contents}
                    className="w-3/5 mt-2 mb-1 ml-2 h-3/5 outline-4"
                    style={{
                      outlineStyle: "solid",
                      outlineColor: hl.color,
                    }}
                    alt="이미지 하이라이트"
                  ></img>
                </li>
              </div>
            );
          case 3: // 동영상 하이라이트
            return (
              <div className="inline-flex ml-1 mr-1" key={index}>
                <li key={index}>
                  <div className="flex flex-row mt-2">
                    <div className="h-5 opacity-100"></div>
                    <YoutubeTimeStamp
                      time={hl.contents}
                      setTime={youtubeTimeSet}
                    ></YoutubeTimeStamp>
                  </div>
                </li>
              </div>
            );
          default:
        }
      }
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
      setCurrentFeedId({
        feed_id: props.id,
        feed_title: props.title,
      });
    }
    setCommentIsClicked(!commentIsClicked);
  }

  // 세줄요약 api
  const threeTriHandler = async () => {
    // console.log(props.id);
    if (!threeTrigger && props.url.includes("https://n.news.naver.com")) {
      const three = await axios({
        method: "post",
        url: `${process.env.REACT_APP_HOST}/api/summary`,
        data: {
          url: props.url,
          id: props.id,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      setSummary(three.data.data.summary);
    }
    setThreeTrigger(!threeTrigger);
  };

  // 북마크 콜백
  const bookmarkCallback = () => {
    setIsBookmarked(!isBookmarked);
  };
  // 댓글 수 콜백
  const commentCountCallback = (action: string) => {
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
              className="object-cover w-5 h-5 ml-1 rounded-full shadow-sm border-circle"
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
          <ThreeLineSummary url={props.url} id={props.id}></ThreeLineSummary>
        )}

        {/*    <div
        //     onClick={threeTriHandler}
        //     className="my-1 text-sm font-bold text-gray-500 cursor-pointer hover:text-gray-700"
        //   >
        //     <span className="mr-1 text-xl">🤖</span> "3줄로 요약해줘"
        //   </div>
        // )}
        // <div className="">
        //   {threeTrigger &&
        //     summary.split("\n").map((line, index) => (
        //       <div
        //         className="mt-1 text-sm font-bold ml-7 text-sky-400 animate-fade-in-down"
        //         key={index}
        //       >
        //         {index + 1}. {line} <br />
        //       </div>
        //     ))}
        // </div> */}
        {/* 하이라이트 section */}
        <div className="mb-5 ">
          <ul className="space-y-0.5">{highlights}</ul>
          {youtubeCode && (
            <div className="mt-3 iframeContainer iframe16To9">
              <iframe
                title={props.title}
                src={
                  youtubeTime
                    ? `https://www.youtube.com/embed/${youtubeCode}?start=${youtubeTime}&autoplay=1&mute=1}`
                    : `https://www.youtube.com/embed/${youtubeCode}`
                }
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        {/* 노션 북마크처럼 만들기 프로젝트 */}
        {!youtubeCode && (
          <a href={props.url} target="_blank" rel="noreferrer">
            <div
              className="flex h-20 mb-2 ml-4 overflow-hidden rounded-lg shadow-sm cursor-pointer"
              style={{ width: "95%", height: "85px" }}
            >
              <div className="w-20 h-full" style={{ width: "85px" }}>
                {props.idx > 3 ? (
                  <LazyImage
                    className="object-cover w-full h-full rounded-sm"
                    src={props.og_image}
                  ></LazyImage>
                ) : (
                  <img
                    className="object-cover w-full h-full rounded-sm"
                    src={props.og_image}
                    alt=""
                  />
                )}
              </div>
              <div className="flex-1 px-5 my-auto">
                <h4 className="mb-1 text-sm font-semibold tracking-tight text-gray-700">
                  {props.title}
                </h4>
                <p className="text-xs text-gray-500 textTruncate">
                  {props.description.substring(0, 70)}...
                </p>
              </div>
            </div>
          </a>
        )}

        {/* 태그 section */}
        <div className="flex flex-wrap mt-2">{tags}</div>
        {/* 태그 수정 section */}
        <div className="flex items-center justify-between mt-4 ml-2 text-sm text-gray-500 ">
          <FeedTagEdit
            // key={props.key}
            tag={props.tag}
            feed_id={props.id}
            feedTitle={props.title}
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
  );
};

export default FeedItem;
