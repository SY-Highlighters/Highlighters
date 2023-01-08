import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
} from "../../states/atom";
import GroupModal from "./GroupModal";
export default function Group() {
  const [groupAdd, setGroupAdd] = useRecoilState(groupAddState);
  const [groupJoin, setGroupJoin] = useRecoilState(groupJoinState);
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);

  const handleGroupAdd = () => {
    setGroupModal(!groupModal);
    setGroupAdd(true);
  };

  const handleGroupJoin = () => {
    setGroupModal(!groupModal);
    setGroupJoin(true);
  };

  return (
    <div className="flex flex-col justify-end">
      {/* <button
        onClick={handleGroupAdd}
        className="h-12 px-6 mt-5 text-indigo-100 transition-colors duration-150 bg-indigo-500 rounded-md w-1/7 selection:justify-center focus:shadow-outline hover:bg-indigo-800"
      >
        <p className="text-bold">그룹 생성</p>
      </button>

      <button
        onClick={handleGroupJoin}
        className="h-12 px-6 mt-5 text-indigo-100 transition-colors duration-150 rounded-md bg-rose-300 w-1/7 selection:justify-center focus:shadow-outline hover:bg-rose-500"
      >
        <p className="text-bold">그룹 참여</p>
      </button> */}
      {groupModal && <GroupModal></GroupModal>}
    </div>
  );
}
