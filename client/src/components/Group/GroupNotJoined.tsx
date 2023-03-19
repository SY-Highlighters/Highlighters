import { UserGroupIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
} from "../../atoms/atom"
import { userInfo } from "../../atoms/user";
import GroupJoined from "./GroupJoined";
import GroupModal from "./Modal/GroupModal";
export default function GroupNotJoined() {
  const [groupAdd, setGroupAdd] = useRecoilState(groupAddState);
  const [groupJoin, setGroupJoin] = useRecoilState(groupJoinState);
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);
  // const userData = useRecoilValue(userInfo);
  // const groupState = userData.groupId;

  const handleGroupAdd = () => {
    setGroupModal(!groupModal);
    setGroupAdd(true);
  };

  const handleGroupJoin = () => {
    setGroupModal(!groupModal);
    setGroupJoin(true);
  };
  return (
    <div className="w-full mt-4 bg-white rounded-lg shadow-lg">
      <div className="relative p-6 rounded-3xl">
        <h3 className="mt-3 mb-3 antialiased font-bold text-gray-600 text-1xl">
          그룹에 참가하세요!
        </h3>
        {/* 그룹 초대 버튼 만들기 */}
        <div className="relative flex items-end justify-end">
          <button
            onClick={handleGroupAdd}
            className="inline-flex mr-2 mt-2 px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-500 hover:bg-indigo-700"
          >
            그룹 생성
          </button>
          <button
            onClick={handleGroupJoin}
            className="inline-flex mr-2 mt-2 px-3 py-0.5 rounded-full text-sm font-medium bg-rose-100 text-rose-500 hover:bg-rose-600"
          >
            그룹 참여
          </button>
        </div>
      </div>
    </div>
  );
}
