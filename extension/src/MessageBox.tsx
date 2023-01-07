import Noti from "./Noti";
const dummy_noti = [
  {
    name: "김현진",
    message: "이거 보라니깐",
  },
  {
    name: "박예린",
    message: "이제 점심 먹을게요",
  },
  {
    name: "김성태",
    message: "이거 먹자",
  },
];
export default function MessageBox() {
  const notiList = dummy_noti.map((noti) => (
    <Noti name={noti.name} message={noti.message}></Noti>
  ));
  return (
    <div className="mx-3">
          <ul>{notiList}</ul>

    </div>
  );
}
