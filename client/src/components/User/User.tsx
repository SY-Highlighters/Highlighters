import UserInfo from "./UserInfo";
import GroupTag from "./GroupTag";
const User = () => {
  return (
    <div className="basis-1/4">
      {/* <aside className="grid m-8 lg:ml-30 lg:mt-10 grid-col-2"> */}
      <aside className="grid grid-col-2">
        <UserInfo></UserInfo>
        <GroupTag></GroupTag>
      </aside>
    </div>
  );
};

export default User;
