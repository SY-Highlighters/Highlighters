import { ChevronDownIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
  groupInviteState,
  userInfoState,
  groupMemberVisibleState,
} from "../../states/atom";
import { GroupMember } from "./GroupMember";
import GroupModal from "./Modal/GroupModal";
export default function GroupJoined(props: any) {
  const [groupAdd, setGroupAdd] = useRecoilState(groupAddState);
  const [groupJoin, setGroupJoin] = useRecoilState(groupJoinState);
  const [groupInvite, setGroupInvite] = useRecoilState(groupInviteState);
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);
  const userData = useRecoilValue(userInfoState);
  const [groupMemberVisible, setGroupMemberVisible] = useRecoilState(
    groupMemberVisibleState
  );
  const clickedGroupMem = () => {
    setGroupMemberVisible(!groupMemberVisible);
  };
  const handleGroupInvite = () => {
    setGroupModal(!groupModal);
    setGroupInvite(true);
  };
  return (
    <div className="mt-2 bg-white rounded-lg shadow-lg">
      <div className="p-6">
        {/* 그룹명 */}
        <div>
          <p className="text-xs text-gray-600">그룹명</p>
          <div className="relative flex items-end ml-1">
            <h3 className="text-2xl antialiased font-bold">
              {props.userGroup}
            </h3>
          </div>
        </div>

        {/* 그룹 초대 버튼 만들기 */}
        <div className="relative flex items-end justify-end">
          <UserPlusIcon
            onClick={handleGroupInvite}
            className="cursor-pointer w-10 h-10 px-2.5 py-2.5 mt-2 mr-2 text-sm font-medium rounded-full bg-sky-100 text-sky-500 hover:bg-sky-300 hover:scale-85"
          ></UserPlusIcon>
        </div>
        <div onClick={clickedGroupMem} className="flex flex-row cursor-pointer">
          <ChevronDownIcon className="w-5 h-5 text-sm font-medium text-sky-500 hover:scale-85"></ChevronDownIcon>
          <span className="mt-1 ml-1 text-xs text-gray-400">
            {groupMemberVisible ? "닫기" : "그룹원 보기"}
          </span>
        </div>
      </div>
      {groupMemberVisible && <GroupMember></GroupMember>}
    </div>
  );
}
