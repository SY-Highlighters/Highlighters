export default function NotiItem(props: any) {
  function clickedRead() {
    
  }
  return (
    <li>
      <div className="px-4 py-3 mt-5 mb-3 border-t-4 rounded-lg rounded-b shadow-md bg-sky-100 border-sky-500 ">
        <div className="flex">
          <div className="py-1"></div>
          <div>
            <div className="flex flex-row justify-between">
              <p className="text-sm font-bold text-sky-900">
                From. {props.sender}
              </p>
              {/*  닫기 버튼 */}
              <button
                onClick={clickedRead}
                className="text-gray-400 w-7 h-7 hover:text-sky-500"
                aria-hidden="true"
              >
                <svg
                  className="w-5 h-5 ml-4 mb-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <a href={props.url} target="_blank" rel="noreferrer">
              <p className="text-xs font-bold text-gray-800">{props.title}</p>
              <p className="text-xs text-gray-700">{props.contents}</p>
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
