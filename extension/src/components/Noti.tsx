
export default function Noti(props: any) {
  return (
    <li
      id={props.id}
      className="px-4 py-3 mt-3 border-t-4 rounded-lg rounded-b shadow-md bg-sky-100 border-sky-500 hover:bg-sky-600"
      // onClick={()}
    >
      <div className="flex">
        <div className="py-1"></div>
        <div>
          <p className="font-bold text-sky-900">From. {props.sender}</p>
          <a
            className="font-bold text-gray-800"
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {props.title}
          </a>
          <p className="text-sm text-gray-700">{props.contents}</p>
        </div>
      </div>
    </li>
  );
}
