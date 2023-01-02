import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Card from "../UI/Card";
const Alert = () => {
  return (
    <div className="justify-self-center basis-1/4">
      <div className="h-5"></div>
      {/* 그룹 피드 타이틀 */}
      <div className="flex">
        {/* 알림 아이콘 */}
        <BellIcon className="w-5 h-5" />
          </div>
                        {/* 아래로 긴 카드박스 */}
              <div className="flex flex-col">
                  {/* 카드박스 타이틀 */}
                  <div className="flex">
                      <h1 className="font-bold text-1xl">알림</h1>
                  </div>
                  {/* 카드박스 내용 */}
                  <div className="flex flex-col">
                      {/* 카드박스 내용 1 */}
                      <Card>
                          <div className="flex flex-col">
                              <div className="flex">
                                  <h1 className="font-bold text-1xl">알림1</h1>
                              </div>
                              <div className="flex">
                                  <p className="text-sm">알림1 내용</p>
                              </div>
                          </div>
                      </Card>
                      {/* 카드박스 내용 2 */}
                      <div className="flex">
                          <div className="flex flex-col">
                              <div className="flex">
                                  <h1 className="font-bold text-1xl">알림2</h1>
                              </div>
                              <div className="flex">
                                  <p className="text-sm">알림2 내용</p>
                              </div>
                          </div>
                      </div>
              </div>
              </div>
              
    </div>
  );
};

export default Alert;
