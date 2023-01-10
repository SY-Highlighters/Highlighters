import { Fragment } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import AvailableBookmarks from "../Bookmarks/AvailableBookmarks";
import AvailableFeeds from "../Feeds/AvailableFeeds";
import AvailableTags from "../Tags/AvailableTags";
import { TagEditModal } from "../Tags/TagEditModal";
import { useEffect, useState } from "react";
import { mainSectionState, userInfo, tagModalVisble } from "../../states/atom";
import Noti from "../Right/Noti";
import User from "../User/User";
export function Main() {
  const mainSectionNum = useRecoilValue(mainSectionState);
  const [tagModal, setTagModal] = useRecoilState(tagModalVisble);

  const userData = useRecoilValue(userInfo);
  const [localUser, setLocalUser] = useState(userData);

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
  useEffect(() => {
    setLocalUser(userData);
  }, [userData]);
  return (
    <Fragment>
      <div className="flex flex-row gap-4 m-8 mx-10 xl:px-40 lg:grid-cols-2 xl:grid-cols-3 sm:grid-cols-1 ">
        <User></User>
        {localUser.groupName && MainSection(mainSectionNum)}

        {/* {logedMain} */}
        {localUser.groupName && <Noti></Noti>}
      </div>

      {tagModal && <TagEditModal></TagEditModal>}
    </Fragment>
  );
}
