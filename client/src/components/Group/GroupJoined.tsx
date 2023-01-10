import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
  groupInviteState,
  userInfoState,
} from "../../states/atom";
import GroupModal from "./Modal/GroupModal";
export default function GroupJoined() {
  const [groupAdd, setGroupAdd] = useRecoilState(groupAddState);
  const [groupJoin, setGroupJoin] = useRecoilState(groupJoinState);
  const [groupInvite, setGroupInvite] = useRecoilState(groupInviteState);
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);
  const userData = useRecoilValue(userInfoState);

  const handleGroupInvite = () => {
    setGroupModal(!groupModal);
    setGroupInvite(true);
  };
  return (
    <div className="w-full mt-10 bg-white rounded-lg shadow-lg">
      <div className="relative p-6 rounded-3xl">
        <div>
          <p className="text-sm text-gray-600">그룹명</p>
          <div className="relative flex items-end ml-1">
            <h3 className="text-2xl antialiased font-bold">
              {userData.groupName}
            </h3>
          </div>
        </div>

        {/* 그룹 초대 버튼 만들기 */}
        <div className="relative flex items-end justify-end">
          <button
            onClick={handleGroupInvite}
            className="inline-flex mr-2 mt-2 px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-500 hover:bg-sky-600"
          >
            그룹원 초대
          </button>
        </div>
      </div>
    </div>
  );
}
