const GroupSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-lg animate-pulse">
      <div className="h-10" />
      <div className="relative p-6 rounded-3xl -top-5">
        <div className="relative flex items-end px-1 justify-left -top-1">
          <div className="flex flex-col space-y-2 ">
            <div className="w-10 h-4 bg-gray-300 rounded-md "></div>
            <div className="w-24 h-6 bg-gray-300 rounded-md "></div>
          </div>
        </div>

        {/* <div>
          <div className="flex bg-gray-300 rounded-full justify-right w -14 h-14"></div>
        </div> */}
      </div>
    </div>
  );
};
export default GroupSkeleton;
