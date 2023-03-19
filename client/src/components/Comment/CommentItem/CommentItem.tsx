import { commentReloadState } from "../../../atoms/atom";
import { useSetRecoilState, useRecoilState, useRecoilValue } from "recoil";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
export function CommentItem(props: any) {
  const [cookies] = useCookies(["logCookie"]);
  const date = new Date(props.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const min = date.getMinutes();
  // console.log(props.writer, props.userId);
  const host_url = `${process.env.REACT_APP_HOST}/api/comment/delete/${props.id}`;
  const setCommentReload = useSetRecoilState(commentReloadState);

  const commentDelHandler = async () => {
    // 서버에 태그 삭제 요청
    await axios
      .delete(host_url, {
        headers: {
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      })
      .then(function (response) {
        if (response) {
          setCommentReload((prev) => !prev);
          props.onFunc("del");

          //   const newTagItem = {
          //     tag_name: inputValue,
          //     tag_id: response.data.tag_id,
          //   };
          //   setTagList([...tagList, newTagItem]);
        } else {
          alert("댓글 삭제 실패!");
        }
      });

    // 리액트쿼리에 저장된 태그리스트 업데이트

    // setTestDel(!testDel);
  };

  const delClickHandler = () => {
    Swal.fire({
      title: "댓글을 삭제하시겠습니까?",
      text: "삭제된 댓글은 복구할 수 없습니다.",
      icon: "warning",

      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: "#d33", // confrim 버튼 색깔 지정
      cancelButtonColor: "#3085d6", // cancel 버튼 색깔 지정
      confirmButtonText: "삭제", // confirm 버튼 텍스트 지정
      cancelButtonText: "취소", // cancel 버튼 텍스트 지정

      reverseButtons: true, // 버튼 순서 거꾸로
    }).then((result) => {
      // 만약 Promise리턴을 받으면,
      if (result.isConfirmed) {
        // 만약 모달창에서 confirm 버튼을 눌렀다면
        commentDelHandler();
      }
    });
  };
  return (
    <div className="flex flex-col mt-7">
      <div className="flex flex-row">
        <img className="w-10 h-10 rounded-full" src={props.profileImg} alt="" />
        <div className="flex flex-col ml-7">
          <div className="flex flex-row">
            <div className="font-bold">{props.writer}</div>
            {/* extra */}
            {/* 날짜는 위로, 시간은 아래로 표시 */}
            <div className="mt-1 ml-2 text-xs text-gray-500">
              {` ${year}년 ${month}월 ${day}일 ${hours}시 ${min}분`}
            </div>
          </div>
          <div className="text-sm text-gray-700">{props.content}</div>
          {/* extra */}
          {/* <div className="flex flex-row mt-2">
                <div className="text-xs text-gray-500">좋아요</div>
                <div className="ml-2 text-xs text-gray-500">답글</div>
              </div> */}
          {props.userId === props.writer && (
            <div className="-mt-1">
              {/* <button className="text-xs text-gray-500 hover:text-gray-600">
                수정
              </button> */}
              <button
                onClick={delClickHandler}
                className="text-xs text-gray-500 hover:text-gray-600"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
