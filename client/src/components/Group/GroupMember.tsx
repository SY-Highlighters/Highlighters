import { useEffect } from "react";
import { useGroupMember } from "../../hooks/useGroupMember";
export function GroupMember() {
  const { data: groupMember, isSuccess } = useGroupMember();
  console.log(groupMember);
  return (
    <div className="h-12 px-2 overflow-y-auto xl:scrollbar-hide ">
      <ul className="flex flex-col space-y-2">
        {isSuccess &&
          groupMember &&
          groupMember.map((member: any) => (
            <li className="flex items-center justify-between">
              <div className="flex items-center ml-3">
                <img
                  className="w-5 h-5 rounded-full"
                  src={member.image}
                  alt=""
                />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {member.nickname}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
