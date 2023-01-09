export default function NotiItem(props: { message: String; sender: String }) {
  return (
    <li>
      <div className="px-4 py-3 mb-3 border-t-4 rounded-lg rounded-b shadow-md bg-sky-100 border-sky-500 hover:bg-sky-200">
        <div className="flex">
          <div className="py-1"></div>
          <div>
            <p className="font-bold text-sky-900">{props.sender}</p>
            <p className="text-sm text-sky-700">"{props.message}"</p>
          </div>
        </div>
      </div>
    </li>
  );
}
