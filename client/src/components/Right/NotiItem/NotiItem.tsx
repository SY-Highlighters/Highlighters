export default function NotiItem(props: { message: String; sender: String }) {
  return (
    <li>
      <div className="px-4 py-3 border-t-4 rounded-lg rounded-b shadow-md text-sky-900 bg-sky-100 border-sky-500">
        <div className="flex">
          <div className="py-1"></div>
          <div>
            <p className="font-bold">{props.sender}</p>
            <p className="text-sm">{props.message}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
