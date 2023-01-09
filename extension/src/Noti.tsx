export default function Noti(props: any) {
  return (
    <li className="px-4 py-3 mt-3 border-t-4 rounded-lg rounded-b shadow-md bg-sky-100 border-sky-500 hover:bg-sky-600">
      <div className="flex">
        <div className="py-1"></div>
        <div>
          <p className="font-bold text-sky-900">To. {props.sender}</p>
          <p className="font-bold text-gray-800">{props.title}</p>
          <p className="text-sm text-gray-700">{props.contents}</p>
        </div>
      </div>
    </li>
  );
}
