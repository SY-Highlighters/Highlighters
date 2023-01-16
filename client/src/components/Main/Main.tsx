import { Fragment } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import AvailableFeeds from "../Feeds/AvailableFeeds";
import AvailableTags from "../Tags/AvailableTags";
import { FeedTagEditModal } from "../Tags/FeedTagEditModal";
import { mainSectionState, tagModalVisble } from "../../states/atom";
import { AvailableBookmarks } from "../Bookmarks/AvailableBookmarks";
import Noti from "../Noti/Noti";
import User from "../User/User";
import { useCookies } from "react-cookie";
import { useUserData } from "../../hooks/useUserData";
import { FeedsDay } from "../Calender/FeedsDay";
export function Main() {
  const [cookies, setCookie, removeCookie] = useCookies(["logCookie"]);

  const mainSectionNum = useRecoilValue(mainSectionState);
  const [tagModal, setTagModal] = useRecoilState(tagModalVisble);
  const { data: user, isSuccess } = useUserData(cookies);

  const MainSection = (setionNum: number) => {
    switch (setionNum) {
      case 0:
        return <AvailableFeeds></AvailableFeeds>;
      case 1:
        return <AvailableBookmarks></AvailableBookmarks>;
      case 2:
        return <AvailableTags></AvailableTags>;
      case 3:
        return <FeedsDay></FeedsDay>;
      default:
        return <AvailableFeeds></AvailableFeeds>;
    }
  };
  // useEffect(() => {
  //   setLocalUser(userData);
  // }, [userData]);
  return (
    <Fragment>
      {/* <div className="flex-1 mt-5 overflow-y-auto xl:grid-row xl:grid"> */}
      <div className="box-border h-full gap-3 p-5 pb-5 xl:overflow-hidden xl:px-20 xl:flex-row xl:flex">
        {/* <div className="box-border p-5 px-20 overflow-x-hidden overflow-y-auto xl:flex-row xl:flex"> */}
        <User></User>
        {isSuccess && user.group_id && MainSection(mainSectionNum)}
        {isSuccess && user.group_id && <Noti></Noti>}
      </div>
      
      {tagModal === 1 && <FeedTagEditModal></FeedTagEditModal>}
      {/* {tagModal === 2 && <GroupTagEditModal></GroupTagEditModal>} */}
    </Fragment>
  );
}
