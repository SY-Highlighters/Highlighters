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
} from "../../states/atom";
import { useRecoilValue } from "recoil";
export function Comment() {
  const currentFeedId = useRecoilValue(currentFeedIdState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  const { data: commentList, isSuccess } = useQuery(
    "commentList",
    async () => {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_HOST}/api/comment/get/${currentFeedId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.logCookie}`,
        },
      });
      return response.data;
    },
    {
      enabled: currentFeedId !== undefined,
    }
  );

  //   const commentList = tagList.map((tagItem: any) => (
  //     <TagEditItem
  //       tagName={tagItem.tag_name}
  //       feedId={currentFeedId}
  //       tagId={tagItem.tag_id}
  //     />
  //   ));
  return (
    <div>
      <CommentInput></CommentInput>
      <ul>
        {isSuccess &&
          commentList.map((commentItem: any) => <CommentItem></CommentItem>)}
      </ul>
    </div>
  );
}
