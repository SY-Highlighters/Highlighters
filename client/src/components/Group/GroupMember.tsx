import { useEffect } from "react";
import {
  DocumentIcon,
  DocumentPlusIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import { useRecoilState } from "recoil";
import { groupModalVisble, groupMemberVisibleState } from "../../atoms/atom";
import { useGroupMember } from "../../hooks/useGroupMember";

export function GroupMember() {
  const [groupMemberVisible, setGroupMemberVisible] = useRecoilState(
    groupMemberVisibleState
  );
  const clickedGroupMem = () => {
    setGroupMemberVisible(!groupMemberVisible);
  };
  const { data: groupMember, isSuccess } = useGroupMember();
  // console.log(groupMember);
  return (
    <div>
      <div className="flex justify-center -space-x-1 overflow-hidden">
        {/* <ul classNameName="flex flex-col space-y-2"> */}

        {isSuccess &&
          groupMember &&
          // 6번쨰 부터
          groupMember
            .slice(5)
            .map((member: any, index: number) => (
              <img
                key={index}
                className="inline-block w-10 h-10 rounded-full ring-2 ring-white"
                src={member.image}
                alt=""
              />
            ))}
      </div>
      <div className="pb-2 mt-2 ml-6 text-sm font-medium">
        <span
          onClick={clickedGroupMem}
          className="text-blue-500 cursor-pointer"
        >
          - 닫기
        </span>
      </div>
    </div>
  );
}
