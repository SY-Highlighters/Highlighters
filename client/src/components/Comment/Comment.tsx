import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem/CommentItem";
import { useEffect, useState } from "react";
// import { useRecoilState, useRecoilValue } from "recoil";
// import {
//   groupFeedListState,
//   userInfoState,
//   tagModalVisble,
// } from "../../states/atom";
import { useCookies } from "react-cookie";
// import { useEffect } from "react";
import axios from "axios";
import { DocumentIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
// import { TagEditModal } from "../Tags/TagEditModal";
import { QueryCache, useQuery, QueryClient, useQueryClient } from "react-query";
import {
  tagsInFeedState,
  userInfoState,
  currentFeedIdState,
  testRender,
} from "../../states/atom";
import { useRecoilValue } from "recoil";
export function Comment(props: any) {
  const currentFeedId = useRecoilValue(currentFeedIdState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [commentList, setCommentList] = useState([]);
  const test = useRecoilValue(testRender);

  // const { data: commentList, isSuccess } = useQuery(
  //   ["commentList", test, props.reset],
  //   async () => {
  //     const response = await axios({
  //       method: "get",
  //       url: `${process.env.REACT_APP_HOST}/api/comment/get/${currentFeedId}`,
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${cookies.logCookie}`,
  //       },
  //     });
  //     return response.data.data;
  //   },
  //   {
  //     enabled: currentFeedId !== undefined,
  //   }
  // );

  useEffect(() => {
    async function fetchData() {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/comment/get/${currentFeedId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      setCommentList(response.data.data);
    }
    fetchData();
  }, [test]);

  return (
    <div>
      <CommentInput></CommentInput>
      <ul>
        {commentList.map((commentItem: any) => (
          <CommentItem
            key={commentItem.id}
            content={commentItem.contents}
            nickname={commentItem.nickname}
            date={commentItem.createdAt}
            profileImg={commentItem.profile_image}
          ></CommentItem>
        ))}
      </ul>
    </div>
  );
}
