import { useRecoilState } from "recoil";
import { clickedGroupTagDelState } from "../../atoms/atom";
import { Suspense, lazy } from "react";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import GroupTagSkeleton from "../UI/GroupTagSkeleton";
const GroupTagList = lazy(() => import("./GroupTagList"));
const GroupTagListEdit = lazy(() => import("./GroupTagListEdit"));

const GroupTag = () => {
  const [clickedGroupTagDel, setclickedGroupTagDel] = useRecoilState(
    clickedGroupTagDelState
  );
  // 그룹 태그 삭제 버튼 클릭 핸들러
  function groupTagDeleteHandler() {
    setclickedGroupTagDel(!clickedGroupTagDel);
  }
  return (
    <div
      className={"mt-5 bg-white rounded-lg shadow-lg h-full"}
      style={{
        // height: "35vh"
        maxHeight: "35vh",
      }}
    >
      <div className="mx-6 mt-5 mb-2">
        <div className="flex items-end">
          <h3 className="text-xl antialiased font-bold ">그룹 태그</h3>
          <ArchiveBoxXMarkIcon
            onClick={groupTagDeleteHandler}
            className="w-5 h-5 mb-1 ml-3 text-red-400 cursor-pointer hover:text-red-600 hover:scale-95"
          ></ArchiveBoxXMarkIcon>
        </div>
      </div>

      <div className="m-2 mx-5 overflow-y-auto h-3/4 ">
        <ul>
          {clickedGroupTagDel ? (
            <Suspense fallback={<GroupTagSkeleton />}>
              <GroupTagListEdit></GroupTagListEdit>
            </Suspense>
          ) : (
            <Suspense fallback={<GroupTagSkeleton />}>
              <GroupTagList></GroupTagList>
            </Suspense>
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroupTag;
