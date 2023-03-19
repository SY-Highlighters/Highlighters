import { logModalVisble } from "../../atoms/atom";
import { useRecoilState } from "recoil";
export default function Intro() {
  const [loginModalState, setLoginModalState] = useRecoilState(logModalVisble);

  const loginModalHandler = () => {
    setLoginModalState(!loginModalState);
  };

  return (
    <div>
      <div className="grid p-10 space-y-5 justify-items-center bg-sky-600">
        <h1 className="mb-3 text-3xl font-bold text-white xl:text-5xl ">
          " Highlighters "
        </h1>
        <p className="text-2xl text-white">
          링크를 공유하고, 관리하고, 북마크하세요.
        </p>
        <button
          onClick={loginModalHandler}
          className="h-12 px-6 mt-5 text-white transition-colors duration-150 rounded-md w-1/7 selection:justify-center bg-sky-500 focus:shadow-outline hover:bg-sky-800"
        >
          <p className="text-bold">시작하기</p>
        </button>
      </div>
      {/* 소개문*/}
      <div className="gap-4 p-10 mt-20 space-y-10 xl:grid xl:grid-cols-3">
        <div className="flex flex-col justify-center ">
          <img
            src="https://img.icons8.com/ios/100/000000/link--v1.png"
            alt="like"
            className="w-20 h-20 mx-auto"
          />
          <h1 className="mt-10 text-2xl text-center font-extralight">
            링크 공유
          </h1>
          <p className="text-center text-gray-400">
            익스텐션을 통해 쉽게 링크를 공유 가능합니다.
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <img
            src="https://img.icons8.com/ios-glyphs/512/activity-feed-2.png"
            alt="like"
            className="w-20 h-20 mx-auto"
          />
          <h1 className="mt-10 text-2xl text-center font-extralight">
            피드 공유
          </h1>
          <p className="text-center text-gray-400">
            동료, 팀원과 피드를 공유할 수 있습니다.
          </p>
        </div>
        <div className="flex flex-col justify-center">
          <img
            src="https://img.icons8.com/external-smashingstocks-glyph-smashing-stocks/512/external-Highlight-education-and-learning-smashingstocks-glyph-smashing-stocks.png"
            alt="like"
            className="w-20 h-20 mx-auto"
          />
          <h1 className="mt-10 text-2xl text-center font-extralight">
            하이라이트 공유
          </h1>
          <p className="text-center text-gray-400">
            웹페이지에 기록하고 싶은 내용을 하이라이트로 남길 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
