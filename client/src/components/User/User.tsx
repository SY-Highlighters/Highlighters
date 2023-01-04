import UserInfo from "./UserInfo";
import GroupTag from "./GroupTag";
const User = () => {
  return (
    <aside className="grid mt-5 ml-20 bg-white grid-col-2">
      <UserInfo></UserInfo>
      <GroupTag></GroupTag>
    </aside>
  );
};

export default User;
