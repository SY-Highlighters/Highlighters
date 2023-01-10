import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
  userInfoState,
} from "../../states/atom";
// import GroupJoined from "./GroupJoined";
import GroupModal from "./Modal/GroupModal";
import GroupNotJoined from "./GroupNotJoined";

const GroupJoined = React.lazy(async () => import("./GroupJoined"));
export default function Group() {
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);
  const userData = useRecoilValue(userInfoState);
  const [localUser, setLocalUser] = useState(userData);

  useEffect(() => {
    setLocalUser(userData);
  }, [userData]);

  return (
    <div className="flex flex-col justify-end">
      {localUser.groupId ? (
        <GroupJoined></GroupJoined>
      ) : (
        <GroupNotJoined></GroupNotJoined>
      )}
      {groupModal && <GroupModal></GroupModal>}
    </div>
  );
}
