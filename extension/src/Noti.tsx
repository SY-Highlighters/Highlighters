export default function Noti(props: any) {
  return (
    <li className="px-4 py-3 mt-3 border-t-4 rounded-lg rounded-b shadow-md text-sky-900 bg-sky-100 border-sky-500">
      <div className="flex">
        <div className="py-1"></div>
        <div>
          <p className="font-bold">{props.name}</p>
          <p className="text-sm">{props.message}</p>
        </div>
      </div>
    </li>
  );
}
