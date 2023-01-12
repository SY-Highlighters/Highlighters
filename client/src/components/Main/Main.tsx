import { Fragment } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import AvailableFeeds from "../Feeds/AvailableFeeds";
import AvailableTags from "../Tags/AvailableTags";
import { FeedTagEditModal } from "../Tags/FeedTagEditModal";
import { useEffect, useState } from "react";
import {
  mainSectionState,
  userInfoState,
  tagModalVisble,
} from "../../states/atom";
import { AvailableBookmarks } from "../Bookmarks/AvailableBookmarks";
import { useQueryClient } from "react-query";
import Noti from "../Noti/Noti";
import User from "../User/User";
// import { GroupTagEditModal } from "../Tags/GroupTagEditModal";
export function Main() {
  const mainSectionNum = useRecoilValue(mainSectionState);
  const [tagModal, setTagModal] = useRecoilState(tagModalVisble);
  const queryClient = useQueryClient();

  // const userData = useRecoilValue(userInfoState);
  // const [localUser, setLocalUser] = useState(userData);
  // console.log(queryClient);
  const user = queryClient.getQueryData("user");
  const MainSection = (setionNum: number) => {
    switch (setionNum) {
      case 0:
        return <AvailableFeeds></AvailableFeeds>;
      case 1:
        return <AvailableBookmarks></AvailableBookmarks>;
      case 2:
        return <AvailableTags></AvailableTags>;
      default:
        return <AvailableFeeds></AvailableFeeds>;
    }
  };
  // useEffect(() => {
  //   setLocalUser(userData);
  // }, [userData]);
  return (
    <Fragment>
      <div className="flex flex-row gap-4 m-8 mx-10 xl:px-40 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1 ">
        <User></User>
        {/* {localUser.groupName && MainSection(mainSectionNum)} */}
        {MainSection(mainSectionNum)}
        {}
        {/* {logedMain} */}
        {/* {localUser.groupName && <Noti></Noti>} */}
        <Noti></Noti>
      </div>

      {tagModal === 1 && <FeedTagEditModal></FeedTagEditModal>}
      {/* {tagModal === 2 && <GroupTagEditModal></GroupTagEditModal>} */}
    </Fragment>
  );
}
