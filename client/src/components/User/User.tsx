import UserInfo from "./UserInfo";
import Group from "../Group/Group";
import GroupTag from "./GroupTag";
import { UserIcon } from "@heroicons/react/24/outline";
import { useUserData } from "../../hooks/useUserData";

const User = () => {

  const { data: user, isSuccess } = useUserData();
  return (
    <div className="hidden pl-14 basis-1/4 xl:block">
      {/* <div className="hidden xl:w-1/5 xl:fixed xl:left-30 xl:block"> */}
      <aside className="grid grid-col-2">
        {/* ui ver1  */}
        <div className="mb-5 rounded-md opacity-90 bg-sky-500">
          <div className="px-3 py-2 mx-auto rounded-lg max-w-7xl sm:px-6 lg:px-8">
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
        {/* {isSuccess && <UserInfo user={user}></UserInfo>} */}
        <UserInfo></UserInfo>
        {isSuccess && (
          <Group groupName={user.group_name} groupId={user.group_id}></Group>
        )}
        {/* <Group groupName={user.group_name} groupId={user.group_id}></Group> */}
        {isSuccess && user.group_id && <GroupTag></GroupTag>}
      </aside>
    </div>
  );
};

export default User;
