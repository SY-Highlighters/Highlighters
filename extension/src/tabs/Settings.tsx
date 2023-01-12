import ColorButton from "../components/ColorButton";
import Toggle from "../components/Toggle";

export default function Settings() {
  return (
    <div className="px-4 py-3">
      <div>
        <h1 className="my-1 text-base font-semibold text-left text-sky-500 ">
          하이라이터 색상
        </h1>
        <div className="my-2 grid grid-cols-5">
          <ColorButton
            css="bg-red-200 hover:bg-red-300 text-gray-800 font-bold py-2 px-4 w-15 rounded-l"
            color="#fecaca"
            colorName="Red"
          ></ColorButton>
          <ColorButton
            css="bg-yellow-200 hover:bg-yellow-300 text-gray-800 font-bold py-2 px-4 w-15"
            color="#fef08a"
            colorName="Yellow"
          ></ColorButton>
          <ColorButton
            css="bg-green-200 hover:bg-green-300 text-gray-800 font-bold py-2 px-4 w-15"
            color="#bbf7d0"
            colorName="Green"
          ></ColorButton>
          <ColorButton
            css="bg-blue-200 hover:bg-blue-300 text-gray-800 font-bold py-2 px-4 w-15"
            color="#bfdbfe"
            colorName="Blue"
          >
          </ColorButton>
          <ColorButton
            css="bg-violet-200 hover:bg-violet-300 text-gray-800 font-bold py-2 px-4 w-15 rounded-r"
            color="#e9d5ff"
            colorName="Purple"
          >
          </ColorButton>
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
