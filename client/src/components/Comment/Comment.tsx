import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem/CommentItem";
import { useEffect, useState } from "react";
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
  commentReloadState,
} from "../../states/atom";
import { useRecoilValue, useRecoilState } from "recoil";
import { useUserData } from "../../hooks/useUserData";
export function Comment(props: any) {
  const currentFeedId = useRecoilValue(currentFeedIdState);
  const [cookies] = useCookies(["logCookie"]);
  const [commentList, setCommentList] = useState([]);
  const [commentReload, setcommentReload] = useRecoilState(commentReloadState);

  const { data: user, isSuccess, isLoading, error } = useUserData(cookies);

  useEffect(() => {
    async function fetchData() {
      const response = await getFeedComment(currentFeedId, cookies);
      setCommentList(response.data.data);
      setcommentReload((prev) => !prev);
    }
    fetchData();
    // console.log("코멘트에서 유저", user);
  }, [commentReload]);

  return (
    <div>
      <CommentInput></CommentInput>
      <ul>
        {commentList.map((commentItem: any) => (
          <CommentItem
            key={commentItem.id}
            id={commentItem.id}
            content={commentItem.contents}
            writer={commentItem.nickname}
            date={commentItem.createdAt}
            profileImg={commentItem.profile_image}
            userId={user.nickname}
          ></CommentItem>
        ))}
      </ul>
    </div>
  );
}

async function getFeedComment(
  currentFeedId: number,
  cookies: { logCookie?: any }
) {
  return await axios({
    method: "get",
    url: `${process.env.REACT_APP_HOST}/api/comment/get/${currentFeedId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.logCookie}`,
    },
  });
}
