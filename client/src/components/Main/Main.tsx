import { Fragment } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import FeedsInGroup from "../Feeds/FeedsInGroup";
import GroupFeeds from "../Feeds/GroupFeeds";
import AvailableTags from "../Tags/TagsInFeeds";
import { FeedTagEditModal } from "../Tags/FeedTagEditModal";
import {
  changeMainSectionState,
  mainSectionState,
  tagModalVisble,
} from "../../atoms/atom";
import Noti from "../Noti/Noti";
import User from "../User/User";
import { useCookies } from "react-cookie";
import { useUserData } from "../../hooks/useUserData";
import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { Grid } from "./Grid";
import SearchResults from "../Search/SearchResults";
import { FeedsInDay } from "../Calender/FeedsInDay";
import {
  DocumentIcon,
  DocumentPlusIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import DayFeeds from "../Calender/DayFeeds";
import BookmarkFeeds from "../Bookmarks/BookmarkFeeds";
import TagFeeds from "../Tags/TagFeeds";
export function Main() {
  const [changeMainSection, setChangeMainSection] = useRecoilState(
    changeMainSectionState
  );
  const mainSectionNum = useRecoilValue(mainSectionState);
  const [tagModal, setTagModal] = useRecoilState(tagModalVisble);
  const { data: user, isSuccess } = useUserData();

  const MainSection = (setionNum: number) => {
    switch (setionNum) {
      case 0:
        return <GroupFeeds></GroupFeeds>;
      case 1:
        return <BookmarkFeeds />;
      case 2:
        return <TagFeeds></TagFeeds>;
      case 3:
        return <DayFeeds></DayFeeds>;
      case 4:
        return <SearchResults></SearchResults>;
      default:
        return <GroupFeeds></GroupFeeds>;
    }
  };
  // useEffect(() => {
  //   setLocalUser(userData);
  // }, [userData]);

  const clickedMainChange = () => {
    setChangeMainSection(!changeMainSection);
  };

  return (
    <Fragment>
      {/* <div className="flex-1 mt-5 overflow-y-auto xl:grid-row xl:grid"> */}
      {!changeMainSection ? (
        <div className="h-full gap-3 p-5 px-10 pb-5 xl:overflow-hidden xl:px-36 xl:flex-row xl:flex">
          {/* <div className="box-border p-5 px-20 overflow-x-hidden overflow-y-auto xl:flex-row xl:flex"> */}
          <User></User>
          {isSuccess && user.group_id && MainSection(mainSectionNum)}
          {isSuccess && user.group_id && <Noti></Noti>}
        </div>
      ) : (
        <Grid></Grid>
      )}
      {/* 그리드 화면 */}
      {/*  닫기 버튼 */}

      {/* 태그 편집 모달 */}
      {tagModal === 1 && <FeedTagEditModal></FeedTagEditModal>}
      {/* {tagModal === 2 && <GroupTagEditModal></GroupTagEditModal>} */}
    </Fragment>
  );
}
