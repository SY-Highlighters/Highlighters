import { useSetRecoilState } from "recoil";
import Swal from "sweetalert2";
import { currentColorState } from "../states/atom";

const Toast = Swal.mixin({
  toast: true,
  position: "center",
  showConfirmButton: false,
  timer: 500,
});

export default function ColorButton(props: any) {
  const setCurrentColor = useSetRecoilState(currentColorState);

  async function colorButtonHandler() {
    const setColor = props.color;
    await chrome.storage.sync.set({ highlightColor: setColor });
    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs: any) {
        console.log(tabs[0].id);
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            greeting: "changeCurrentColor",
            data: setColor,
          },
          (response) => {
            // console.log(response);
            setCurrentColor(setColor);
            Toast.fire({
              icon: "success",
              title: "하이라이팅 색이 변경되었습니다",
            });
          }
        );
      }
    );

    // let response = await chrome.runtime.sendMessage({
    //   greeting: "changeCurrentColor",
    // });
  }

  return (
    <button onClick={colorButtonHandler} className={props.css}>
      {props.colorName}
    </button>
  );
}
