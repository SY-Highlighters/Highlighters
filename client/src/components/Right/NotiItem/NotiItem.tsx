export default function NotiItem(props: any) {
  return (
    <li>
      <div className="px-4 py-3 mb-3 border-t-4 rounded-lg rounded-b shadow-md bg-sky-100 border-sky-500 hover:bg-sky-200">
        <div className="flex">
          <div className="py-1"></div>
          <div>
            <p className="text-sm font-bold text-sky-900">From. {props.sender}</p>
            <p className="text-xs font-bold text-gray-800">{props.title}</p>
            <p className="text-xs text-gray-700">{props.contents}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
