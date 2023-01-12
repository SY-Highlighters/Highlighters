import UserInfo from "./UserInfo";
import Group from "../Group/Group";
import GroupTag from "./GroupTag";
import { UserIcon } from "@heroicons/react/24/outline";
const User = () => {
  //Todo: 후에 유저정보가 변경되었을때 useEffect함수가 작동해서 다시 유저정보를 리로드해야함
  return (
    <div className="basis-1/4">
      <aside className="grid grid-col-2">
        {/* ui ver1  */}
        <div className="mb-5 rounded-lg bg-sky-500">
          <div className="px-3 py-3 mx-auto rounded-lg max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between ">
              <div className="flex items-center flex-1 w-0 ">
                <span className="flex p-2 mr-1 -ml-3 rounded-lg bg-sky-500 ">
                  <UserIcon className="w-6 h-6 text-white" aria-hidden="true" />
                </span>
                <p className="text-xl font-bold text-white truncate ">
                  <span className="md:hidden">정보</span>
                  <span className="hidden md:inline">정보</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <UserInfo></UserInfo>
        <Group></Group>
        <GroupTag></GroupTag>
      </aside>
    </div>
  );
};

export default User;
