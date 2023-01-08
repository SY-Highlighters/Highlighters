import { useRecoilState } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
  groupInviteState,
} from "../../states/atom";
import GroupModal from "./GroupModal";
const GroupInfo = () => {
  const [groupAdd, setGroupAdd] = useRecoilState(groupAddState);
  const [groupJoin, setGroupJoin] = useRecoilState(groupJoinState);
  const [groupInvite, setGroupInvite] = useRecoilState(groupInviteState);
  const [groupModal, setGroupModal] = useRecoilState(groupModalVisble);

  const handleGroupAdd = () => {
    setGroupModal(!groupModal);
    setGroupAdd(true);
  };

  const handleGroupJoin = () => {
    setGroupModal(!groupModal);
    setGroupJoin(true);
  };
  const handleGroupInvite = () => {
    setGroupModal(!groupModal);
    setGroupInvite(true);
  };
  return (
    <div className="w-full mt-10 bg-white rounded-lg shadow-lg">
      <div className="relative p-6 rounded-3xl">
        {/* <div>
          <p className="text-sm text-gray-600">그룹명</p>
          <div className="relative flex items-end">
            <h3 className="text-2xl antialiased font-bold">정글 5기</h3>
          </div>
        </div> */}
        <h3 className="mt-3 mb-3 antialiased font-bold text-gray-600 text-1xl">
          그룹에 참가하세요!
        </h3>
        {/* 그룹 초대 버튼 만들기 */}
        <div className="relative flex items-end justify-end">
          <button
            onClick={handleGroupInvite}
            className="inline-flex mr-2 mt-2 px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-500 hover:bg-sky-600"
          >
            그룹원 초대
          </button>
          {/* <button className="inline-flex mr-2 mt-2 px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-500 hover:bg-indigo-700">
            그룹 생성
          </button>
          <button className="inline-flex mr-2 mt-2 px-3 py-0.5 rounded-full text-sm font-medium bg-rose-100 text-rose-500 hover:bg-rose-600">
            그룹 참가
          </button> */}
        </div>
      </div>
      {groupModal && <GroupModal></GroupModal>}
    </div>
  );
};

export default GroupInfo;
