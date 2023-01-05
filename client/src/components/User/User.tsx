import UserInfo from "./UserInfo";
import GroupTag from "./GroupTag";
const User = () => {
  return (
    <div className="basis-1/4">
      <aside className="grid grid-col-2">
        <UserInfo></UserInfo>
        <GroupTag></GroupTag>
      </aside>
    </div>
  );
};

export default User;
