const GroupTagSkeleton = () => {
  return (
    <div className="w-full bg-white opacity-40 animate-pulse">
      <div className="h-10" />
      <div className="relative p-6 rounded-3xl -top-5">
        <div className="relative flex items-end justify-left -top-1">
          <div className="flex flex-row space-x-2 ">
            <div className="w-20 h-5 bg-gray-300 rounded-xl "></div>
            <div className="w-20 h-5 bg-gray-300 rounded-xl "></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GroupTagSkeleton;
