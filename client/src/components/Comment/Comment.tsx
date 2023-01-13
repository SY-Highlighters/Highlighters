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
  commentReloadState,
} from "../../states/atom";
import { useRecoilValue } from "recoil";
export function Comment(props: any) {
  const currentFeedId = useRecoilValue(currentFeedIdState);
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);
  const [commentList, setCommentList] = useState([]);
  const commentReload = useRecoilValue(commentReloadState);

  const {
    data: user,
    isSuccess,
    isLoading,
    error,
  } = useQuery(
    ["user"],
    async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_HOST}/api/user/signin`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.logCookie}`,
            },
          }
        );
        return res.data;
      } catch (err) {}
    },
    {
      // cacheTime: 60 * 60 * 1000,
      // 1시간동안 캐시를 사용한다.
      cacheTime: 60 * 60 * 1000,
      staleTime: 2 * 60 * 60 * 1000,
      // Refetch the data when the component mounts, including when the page is refreshed
      refetchOnMount: false,
      // Do not refetch the data when the window gains focus
      refetchOnWindowFocus: false,
      // 쿠키가 준비되었을때 쿼리를 실행한다.
    }
  );

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
    console.log("코멘트에서 유저", user);
  }, [commentReload]);

  return (
    <div>
      <CommentInput></CommentInput>
      <ul>
        {commentList.map((commentItem: any) => (
          <CommentItem
            key={commentItem.id}
            content={commentItem.contents}
            writer={commentItem.nickname}
            date={commentItem.createdAt}
            profileImg={commentItem.profile_image}
            userId={user.id}
          ></CommentItem>
        ))}
      </ul>
    </div>
  );
}
