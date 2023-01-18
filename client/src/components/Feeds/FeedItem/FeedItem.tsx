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
// import AWS from "aws-sdk";
// AWS.config.update({
//   region: "ap-northeast-2",
//   credentials: {
//     accessKeyId: `${process.env.REACT_APP_S3_ACCESS_KEY_ID}`,
//     secretAccessKey: `${process.env.REACT_APP_S3_SECRET_ACCESS_KEY}`,
//   },
// });
const FeedItem = (props: any) => {
  const [commentIsClicked, setCommentIsClicked] = useState(false);
  const setCurrentFeedId = useSetRecoilState(currentFeedIdState);
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

  // // 원본
  // let highlights;
  // let img = "";
  // if (props.highlight.length > 0) {
  //   let firstHighlight = props.highlight[0].user.nickname;
  //   highlights = props.highlight.map(async (hl: any, index: number) => {
  //     if (hl.contents.includes("https://highlighters-s3")) {
  //       let parts = hl.contents.split("/");
  //       let imagePath = parts[parts.length - 1];
  //       console.log(imagePath);
  //       const s3 = new AWS.S3();
  //       const params = {
  //         Bucket: "highlighters-s3",
  //         Key: "picture/" + imagePath,
  //       };
  //       await s3.getObject(params, function (err, data) {
  //         if (err) {
  //           console.log(err, err.stack);
  //         } else {
  //           const imgUrl = URL.createObjectURL(
  //             new Blob([data.Body], { type: "image/png" })
  //           );
  //           img = imgUrl;
  //           console.log("suc", data);
  //         }
  //       });
  //     } else {
  //       img = "";
  //     }

  //     if (firstHighlight !== hl.user.nickname || index === 0) {
  //       firstHighlight = hl.user.nickname;
  //       return (
  //         <div key={index}>
  //           <ul>
  //             <li className="flex flex-row" key={index}>
  //               {" "}
  //               <img
  //                 src={hl.user.image}
  //                 className="w-5 h-5 mr-1 rounded-full"
  //               ></img>
  //               <span
  //                 className="text-xs lg:text-base"
  //                 style={{ backgroundColor: hl.color }}
  //               >
  //                 {img ? (
  //                   <img src={img} className="w-10 h-10"></img>
  //                 ) : (
  //                   hl.contents
  //                 )}
  //                 <img src={img} className="w-10 h-10"></img>
  //               </span>
  //             </li>
  //           </ul>
  //         </div>
  //       );
  //     }
  //     return (
  //       <li className="ml-6" key={index}>
  //         <span
  //           className="text-xs lg:text-base"
  //           style={{ backgroundColor: hl.color }}
  //         >
  //           {/* {img ? (
  //             <img src={img} className="w-10 h-10"></img>
  //           ) : (
  //             hl.contents
  //           )} */}
  //           <img src={img} className="w-10 h-10"></img>
  //         </span>
  //       </li>
  //     );
  //   });
  // }
  // 원본
  let highlights;
  if (props.highlight.length > 0) {
    let firstHighlight = props.highlight[0].user.nickname;
    highlights = props.highlight.map((hl: any, index: number) => {
      if (firstHighlight !== hl.user.nickname || index === 0) {
        firstHighlight = hl.user.nickname;
        const highContent =
          hl.type === 1 ? (
            <span
              className="ml-1 text-xs lg:text-base"
              style={{ backgroundColor: hl.color }}
            >
              {/* hl.contents에서 개행문자 처리 */}
              {hl.contents.trim()}
              {/* {hl.contents} */}
            </span>
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
        <li className="mt-3 ml-6" key={index}>
          {hl.type === 1 ? (
            <span
              className="ml-1 text-xs lg:text-base"
              style={{ backgroundColor: hl.color }}
            >
              {hl.contents}
            </span>
          ) : (
            <img
              src={hl.contents}
              className="w-5/6 ml-2 h-5/6 outline-4"
              style={{ outlineStyle: "solid", outlineColor: hl.color }}
            ></img>
          )}
        </li>
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
  //   setImgUrl("");
  // }, []);

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

        <div className="mb-5 ">
          <ul className="space-y-1.5">{highlights}</ul>
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

          {/* 댓글 버튼 (토글식)*/}
          <div>
            <div className="flex flex-row">
              {" "}
              {/* 즐겨찾기 section */}
              {!props.bookmarked ? (
                <Bookmarked feedId={props.id} />
              ) : (
                <UnBookmarked bookmarkId={props.bookmarkId}></UnBookmarked>
              )}
              <span className="ml-5 mr-1">{props.commentLen}</span>
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
        {commentIsClicked && <Comment reset={commentIsClicked}></Comment>}
      </div>
    </div>
    // </li>
  );
};

export default FeedItem;
