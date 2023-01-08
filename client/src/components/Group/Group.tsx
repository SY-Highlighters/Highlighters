import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
  userInfo,
} from "../../states/atom";
import GroupJoined from "./GroupJoined";
import GroupModal from "./Modal/GroupModal";
import GroupNotJoined from "./GroupNotJoined";
export default function Group() {
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);
  const userData = useRecoilValue(userInfo);
  const groupState = userData.groupId;

  return (
    <div className="flex flex-col justify-end">
      {groupState ? (
        <GroupJoined></GroupJoined>
      ) : (
        <GroupNotJoined></GroupNotJoined>
      )}
      {groupModal && <GroupModal></GroupModal>}
    </div>
  );
}
