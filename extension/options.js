let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// 버튼 클릭에 반응하여 선택된 버튼을 마킹하고 저장합니다.
// 선택
function handleButtonClick(event) {
  // 전에 선택된 색상 버튼의 스타일링을 제거합니다.
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // 선택한 버튼을 마킹합니다.
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
}

// 제공된 각 색상에 대해 페이지에 버튼을 추가합니다.
function constructOptions(buttonColors) {
  chrome.storage.sync.get("color", (data) => {
    let currentColor = data.color;

    for (let buttonColor of buttonColors) {
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;

      if (buttonColor === currentColor) {
        button.classList.add(selectedClassName);
      }

      button.addEventListener("click", handleButtonClick);
      page.appendChild(button);
    }
  });
}

// 색상 옵션을 구성하여 페이지 초기화
constructOptions(presetButtonColors);
