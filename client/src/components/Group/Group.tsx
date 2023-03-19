import { useRecoilValue } from "recoil";
import { groupModalVisble } from "../../atoms/atom";
import GroupModal from "./Modal/GroupModal";
// import GroupNotJoined from "./GroupNotJoined";
// import GroupJoined from "./GroupJoined";
import { useCookies } from "react-cookie";
import { useUserData } from "../../hooks/useUserData";
import GroupSkeleton from "../UI/GroupSkeleton";
import React, { Suspense } from "react";
const GroupJoined = React.lazy(() => import("./GroupJoined"));
const GroupNotJoined = React.lazy(() => import("./GroupNotJoined"));
export default function Group(props: any) {
  const groupModal = useRecoilValue(groupModalVisble);
  const [cookies] = useCookies(["logCookie"]);

  // 유저 데이터 요청
  const { data: user, isSuccess } = useUserData();

  // if (isSuccess) {
  return (
    //QueryClientProvider로 감싸져있어서 queryClient를 사용할 수 있다.
    <div className="mt-4 bg-white rounded-lg shadow-lg">
      <Suspense fallback={<GroupSkeleton />}>
        {props.groupId ? (
          <GroupJoined userGroup={props.groupName}></GroupJoined>
        ) : (
          <GroupNotJoined></GroupNotJoined>
        )}
      </Suspense>
      {/* <GroupSkeleton></GroupSkeleton> */}
      {groupModal && <GroupModal></GroupModal>}
    </div>
  );
  // } else {
  //   // 로딩 중 또는 에러 발생 시 화면 빈 크기의 div를 반환
  //   return (
  //     <div className="mt-4 bg-white rounded-lg shadow-lg">
  //       <div className="h-12" />
  //       <div className="relative p-6 mb-9 rounded-3xl -top-5">
  //         <div className="relative flex items-end px-3 justify-left -top-1"></div>
  //       </div>
  //     </div>
  //   );
  // }

  // return (
  // <div className="flex flex-col justify-end">
  //   {localUser.groupId ? (
  //     <GroupJoined></GroupJoined>
  //   ) : (
  //     <GroupNotJoined></GroupNotJoined>
  //   )}
  //   {groupModal && <GroupModal></GroupModal>}
  // </div>
  // );
}
