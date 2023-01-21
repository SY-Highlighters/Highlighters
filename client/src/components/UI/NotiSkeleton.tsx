import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

const NotiSkeleton = () => {
  return (
    <div className="mt-5 overflow-y-auto bg-white rounded-lg shadow-lg opacity-50 xl:scrollbar-hide h-1/3 ">
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-center justify-center w-20 h-20 mb-3 rounded-full "></div>

        <ChatBubbleOvalLeftEllipsisIcon className="w-10 h-10 animate-bounce opacity-40"></ChatBubbleOvalLeftEllipsisIcon>
      </div>

      {/* <ul>
          <li>
            <div className="px-4 py-3 mt-5 mb-3 border-t-4 rounded-lg shadow-md bg-sky-100 border-sky-500 ">
              <div>
                <div className="flex flex-row center">
                  <p className="text-sm font-bold text-sky-900">
                    <div className="w-20 h-5 bg-gray-300 rounded-sm "></div>
                  </p>
                </div>
                <a href={props.url} target="_blank" rel="noreferrer">
                  <p className="text-xs font-bold text-gray-800">
                    {props.title}
                  </p>
                  <p className="text-xs text-gray-700">{props.contents}</p>
                </a>
              </div>
            </div>
          </li>
        </ul> */}
    </div>
  );
};

export default NotiSkeleton;
