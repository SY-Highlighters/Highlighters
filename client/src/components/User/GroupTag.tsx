import { PaperClipIcon } from "@heroicons/react/20/solid";
import Card from "../UI/Card";
// 더미 유저 정보
const user = {
  name: "김성태",
  email: "tom@example.com",
  imageUrl:
    "https://velog.velcdn.com/images/chobae/post/6bfebba6-5f10-4e2f-b8ec-12a9b26d1bb0/image.png",
};
const GroupTag = () => {
  return (
    <div className="grid grid-cols-1">
      <div>
        <div className="h-40"></div>
      </div>

      {/* 타이틀 */}
      <div className="grid grid-cols-3">
        <div className="col-span-1"></div>
        <div className="col-span-2 px-8">
                <h2 className="font-bold text-1xl justify-self-center">Tag</h2>
        </div>
      </div>


      <div className="grid grid-cols-5">
        <div className="col-span-2"></div>
        {/* 태그 공간 -> fix:동적 처리*/}
        <div className="col-span-3">
          <span className="inline-flex px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
            #모시깽
          </span>
          <span className="inline-flex  px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
            #도커
          </span>
          <span className="inline-flex  px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
            #rest
          </span>
          <span className="inline-flex  px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
            #컴퓨터
          </span>
          <span className="inline-flex  px-3 py-0.5 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
            #컴퓨터
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupTag;