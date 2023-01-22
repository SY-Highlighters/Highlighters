import { useEffect } from "react";
import {
  DocumentIcon,
  DocumentPlusIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";

import { useGroupMember } from "../../hooks/useGroupMember";
export function GroupMember() {
  const { data: groupMember, isSuccess } = useGroupMember();
  // console.log(groupMember);
  return (
    <div className="grid w-full grid-cols-6 px-5 pb-2 overflow-y-auto h-15 xl:scrollbar-hide">
      {/* <ul className="flex flex-col space-y-2"> */}
      {isSuccess && groupMember.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-xs font-bold text-gray-500 ">
            팀원을 초대해보세요 😎
          </p>
        </div>
      )}

      {isSuccess &&
        groupMember &&
        groupMember.map((member: any, index: number) => (
          <div className="mb-3 ml-2">
            <span className="">
              <img
                key={index}
                className="rounded-full shadow-md w-7 h-7"
                src={member.image}
                alt=""
              />
            </span>
          </div>
          //   <li className="flex items-center justify-between f">
          //   <div className="flex items-center ml-3">
          //     <img className="w-5 h-5 rounded-full" src={member.image} alt="" />
          //     {/* <span className="ml-2 text-sm font-medium text-gray-900">
          //           {member.nickname}
          //         </span> */}
          //   </div>
          //   </li>
        ))}

      {/* </ul> */}
    </div>
  );
}
