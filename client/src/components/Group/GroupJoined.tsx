import { UserPlusIcon } from "@heroicons/react/24/outline";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  groupAddState,
  groupJoinState,
  groupModalVisble,
  groupInviteState,
  userInfoState,
} from "../../states/atom";
import GroupModal from "./Modal/GroupModal";
export default function GroupJoined(props: any) {
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
    <div className="w-full mt-4 bg-white rounded-lg shadow-lg">
      <div className="relative p-6 rounded-3xl">
        <div>
          <p className="text-sm text-gray-600">그룹명</p>
          <div className="relative flex items-end ml-1">
            <h3 className="text-2xl antialiased font-bold">
              {props.userGroup}
            </h3>
          </div>
        </div>

        {/* 그룹 초대 버튼 만들기 */}
        <div className="relative flex items-end justify-end">
          {/* <button
            onClick={handleGroupInvite}
            className="inline-flex mr-2 mt-2 px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-500 hover:bg-sky-600"
          >
            그룹원 초대
          </button> */}

          <UserPlusIcon
            onClick={handleGroupInvite}
            className="cursor-pointer w-10 h-10 px-2.5 py-2.5 mt-2 mr-2 text-sm font-medium rounded-full bg-sky-100 text-sky-500 hover:bg-sky-300 hover:scale-85"
          ></UserPlusIcon>
        </div>
      </div>
    </div>
  );
}
