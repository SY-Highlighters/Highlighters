import UserInfo from "./UserInfo";
import Group from "../Group/Group";
import GroupTag from "./GroupTag";
import { useRecoilValue } from "recoil";
import { userInfo } from "../../states/atom";
const User = () => {
  const userdata = useRecoilValue(userInfo);
  return (
    <div className="basis-1/4">
      <aside className="grid grid-col-2">
        <UserInfo></UserInfo>
        {userdata.groupName ? <GroupTag></GroupTag> : <Group></Group>}
        {/* <GroupTag></GroupTag> */}
      </aside>
    </div>
  );
};

export default User;
