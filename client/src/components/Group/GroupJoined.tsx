import { ChevronDownIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
  groupInviteState,
  groupMemberVisibleState,
} from "../../atoms/atom";
import { userInfo } from "../../atoms/user";
import { useGroupMember } from "../../hooks/useGroupMember";

import { GroupMember } from "./GroupMember";
import GroupModal from "./Modal/GroupModal";
export default function GroupJoined(props: any) {
  // const [groupAdd, setGroupAdd] = useRecoilState(groupAddState);
  // const [groupJoin, setGroupJoin] = useRecoilState(groupJoinState);
  const [groupInvite, setGroupInvite] = useRecoilState(groupInviteState);
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);
  // const userData = useRecoilValue(userInfo);
  const [groupMemberVisible, setGroupMemberVisible] = useRecoilState(
    groupMemberVisibleState
  );
  const { data: groupMember, isSuccess } = useGroupMember();
  const clickedGroupMem = () => {
    setGroupMemberVisible(!groupMemberVisible);
  };
  const handleGroupInvite = () => {
    setGroupModal(!groupModal);
    setGroupInvite(true);
  };
  return (
    <div className="mt-2 mb-3 bg-white rounded-lg ">
      <div className="px-6 pt-6">
        {/* 그룹명 */}
        <div className="flex justify-between">
          <div>
            <p className="text-xs text-gray-600">그룹명</p>
            <div className="relative flex items-end ml-1">
              <h3 className="text-2xl antialiased font-bold">
                {props.userGroup}
              </h3>
              <span className="px-2 py-1 mb-1 ml-3 text-xs font-semibold text-indigo-500 bg-indigo-100 rounded-full">
                {isSuccess && groupMember.length}
              </span>
            </div>
          </div>
        </div>
        {/* {isSuccess && groupMember.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <p className="text-xs font-bold text-gray-500 ">
              팀원을 초대해보세요 😎
            </p>
          </div>
        )} */}
        {/* 그룹 초대 버튼 만들기 */}
        <div className="flex justify-center mt-1 cursor-pointer">
          <div className="">
            <div className="flex items-center space-x-2 text-base ">
              {/* <span className="px-2 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                204
              </span> */}
            </div>
            <div className="flex mt-4 -space-x-1 overflow-hidden">
              {isSuccess &&
                groupMember &&
                groupMember
                  .slice(0, 5)
                  .map((member: any, index: number) => (
                    <img
                      key={index}
                      className="inline-block w-10 h-10 rounded-full shadow-md ring-2 ring-white"
                      src={member.image}
                      alt=""
                    />
                  ))}
              <UserPlusIcon
                onClick={handleGroupInvite}
                className="cursor-pointer w-10 h-10 ring-2 ring-white py-2.5 mr-2 text-sm font-medium rounded-full bg-sky-100 text-sky-500 hover:bg-sky-300 hover:scale-85"
              ></UserPlusIcon>
            </div>
          </div>
          <span className="mt-1 ml-1 text-xs text-gray-400"></span>
        </div>
        <div className="mt-3 text-sm font-medium">
          <span
            onClick={clickedGroupMem}
            className="text-blue-500 cursor-pointer"
          >
            {!groupMemberVisible && "+ 더보기"}
          </span>
        </div>
      </div>
      {groupMemberVisible && <GroupMember></GroupMember>}
    </div>
  );
}
