import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
  userInfo,
} from "../../states/atom";
// import GroupJoined from "./GroupJoined";
import GroupModal from "./Modal/GroupModal";
import GroupNotJoined from "./GroupNotJoined";

const GroupJoined = React.lazy(async () => import("./GroupJoined"));
export default function Group() {
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);
  const userData = useRecoilValue(userInfo);
  const [localUser, setLocalUser] = useState(userData);

  useEffect(() => {
    setLocalUser(userData);
  }, [userData]);

  return (
    <div className="flex flex-col justify-end">
      {/* <button
        onClick={handleGroupAdd}
        className="h-12 px-6 mt-5 text-indigo-100 transition-colors duration-150 bg-indigo-500 rounded-md w-1/7 selection:justify-center focus:shadow-outline hover:bg-indigo-800"
      >
        <p className="text-bold">그룹 생성</p>
      </button>
      {localUser.groupId ? (
        <GroupJoined></GroupJoined>
      ) : (
        <GroupNotJoined></GroupNotJoined>
      )}

      <button
        onClick={handleGroupJoin}
        className="h-12 px-6 mt-5 text-indigo-100 transition-colors duration-150 rounded-md bg-rose-300 w-1/7 selection:justify-center focus:shadow-outline hover:bg-rose-500"
      >
        <p className="text-bold">그룹 참여</p>
      </button>
      {groupModal && <GroupModal></GroupModal>}
    </div>
  );
}
