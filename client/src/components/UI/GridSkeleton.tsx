const GridSkeleton = () => {
  const gridList = Array.from({ length: 15 }, (_, i) => (
    <div className="relative group">
      <div className="overflow-hidden bg-gray-200 rounded-md min-h-80 aspect-w-1 aspect-h-1 group-hover:opacity-75 lg:aspect-none lg:h-40">
        <div className="object-cover object-center w-full h-full lg:h-full lg:w-full" />
      </div>
      <div className="flex justify-between mt-2">
        <div className="w-full">
          <div className="w-full h-5 bg-gray-200 rounded-md "></div>
        </div>
      </div>
    </div>
  ));
  return (
    <div className="py-12 mx-auto sm:py-18 sm:px-5 lg:w-full lg:px-10">
      <div
        className="grid grid-cols-1 mt-6 overflow-y-auto opacity-50 gap-y-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8 xl:scrollbar-hide animate-pulse"
        style={{ height: "80vh" }}
      >
        {/* 15번 반복 */}

        {gridList}
      </div>
    </div>
  );
};

export default GridSkeleton;
