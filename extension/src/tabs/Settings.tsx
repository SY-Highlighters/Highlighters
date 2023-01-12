import { useEffect, useState } from "react";
import Toggle from "../components/Toggle";

export default function Settings() {
  return (
    <div className="px-4 py-3">
      <div>
        <h1 className="my-1 text-base font-semibold text-left text-sky-500 ">
          하이라이터 색상
        </h1>
        <div className="my-2 grid grid-cols-5">
          <button className="bg-red-300 hover:bg-red-400 text-gray-800 font-bold py-2 px-4 w-15">
            Red
          </button>
          <button className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-bold py-2 px-4 w-15">
            Yellow
          </button>
          <button className="bg-green-300 hover:bg-green-400 text-gray-800 font-bold py-2 px-4 w-15">
            Green
          </button>
          <button className="bg-blue-300 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 w-15">
            Blue
          </button>
          <button className="bg-violet-300 hover:bg-violet-400 text-gray-800 font-bold py-2 px-4 w-15">
            Violet
          </button>
        </div>
      </div>
      <div>
        <h1 className="my-1 text-base font-semibold text-left text-sky-500 ">
          알림 설정
        </h1>
        <Toggle></Toggle>
      </div>
    </div>
  );
}
