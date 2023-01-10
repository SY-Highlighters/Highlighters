/* 코드시작 */
const highlightColor = "#E9D5FF";

let selectionText;
let highlightStr = "null";

const modalOverlay = `width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.25);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(1.5px);
            -webkit-backdrop-filter: blur(1.5px);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.18);
            z-index: 2147483647`;

const modalWindow = `background: rgba( 69, 139, 197, 0.70 );
            box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
            backdrop-filter: blur( 13.5px );
            -webkit-backdrop-filter: blur( 13.5px );
            border-radius: 10px;
            border: 1px solid rgba( 255, 255, 255, 0.18 );
            width: 400px;
            height: 500px;
            position: relative;
            top: -100px;
            padding: 10px;`;

const modalTitle = `padding-left: 10px;
            display: inline;
            text-shadow: 1px 1px 2px gray;
            color: white;`;

const modalContent = `margin-top: 20px;
            padding: 0px 10px;
            text-shadow: 1px 1px 2px gray;
            color: white;`;

async function highlight() {
  const range = selectionText.getRangeAt(0);
  postHighlight(range, highlightStr);
}

function makeXPath(node, currentPath) {
  /* this should suffice in HTML documents for selectable nodes, XML with namespaces needs more code */
  currentPath = currentPath || "";
  switch (node.nodeType) {
    case 3:
    case 4:
      return makeXPath(
        node.parentNode,
        "text()[" +
          (document.evaluate(
            "preceding-sibling::text()",
            node,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
          ).snapshotLength +
            1) +
          "]"
      );
    case 1:
      return makeXPath(
        node.parentNode,
        node.nodeName +
          "[" +
          (document.evaluate(
            "preceding-sibling::" + node.nodeName,
            node,
            null,
            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
            null
          ).snapshotLength +
            1) +
          "]" +
          (currentPath ? "/" + currentPath : "")
      );
    case 9:
      return "/" + currentPath;
    default:
      return "";
  }
}

function showLoginModal() {
  // 펜 버튼 숨기기
  const button = document.getElementById("btn_highlighters");
  button.style.display = "none";

  const body = document.querySelector("body");

  // 모달 만들어서 띄우기
  let loginModal = `<div id="modal" class="modal-overlay">
        <div id="modal-window">
            <div id="modal-title">
                <h2 display: inline>로그인하세요</h2>
            </div>
            <div id="modal-close-area">X</div>
            <div id="modal-content">
                아이디<input type="text"><br>
                패스워드<input type="password"><br>
                <a id="modal-button"><br>
            </div>
        </div>
    </div>`;

  body.innerHTML += loginModal;

  const modal = document.getElementById("modal");
  modal.style.cssText = modalOverlay;

  const modal_window = document.getElementById("modal-window");
  modal_window.cssText = modalWindow;

  const modal_title = document.getElementById("modal-title");
  modal_title.cssText = modalTitle;

  const modal_content = document.getElementById("modal-content");
  modal_content.cssText = modalContent;

  body.style.overflowX = "hidden";
  body.style.overflowY = "hidden";
}

function highlightDone(range) {
  const newNode = document.createElement("span");
  newNode.style.backgroundColor = highlightColor;
  range.surroundContents(newNode);

  // 펜 버튼 숨기기
  const button = document.getElementById("btn_highlighters");
  button.style.display = "none";
}

/* 하이라이트 Post */
async function postHighlight(range, highlightStr) {

  const rangeobj = {
    startXPath: makeXPath(range.startContainer),
    startOffset: range.startOffset,
    endXPath: makeXPath(range.endContainer),
    endOffset: range.endOffset,
  };

  chrome.runtime.sendMessage(
    {
      greeting: "postHighlight",
      data: {
        url: range.startContainer.baseURI,
        contents: highlightStr,
        selection: rangeobj,
        title: document.title,
      },
    },
    (response) => {
      if (response.data.statusCode === 401) {
        console.log(
          "unauthorized error status code: ",
          response.data.statusCode
        );
        showLoginModal();
      } else {
        console.log("highlight success");
        highlightDone(range);
      }
    }
  );
}

/* 하이라이트 Get */
function getHighlight(url) {
  chrome.runtime.sendMessage(
    {
      greeting: "getHighlight",
      data: { url },
    },
    (response) => {
      const data = response.data;
      console.log(data);
      if (data.success === false) {
        throw new Error(`[${data.statusCode}] ${data.message}`);
      }

      for (const highlight of data) {
        const selection = highlight.selection;
        const range = document.createRange();

        // 시작 노드 복원
        const startNode = document.evaluate(
          selection.startXPath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        const startOff = Number(selection.startOffset);

        // 종료 노드 복원
        const endNode = document.evaluate(
          selection.endXPath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        const endOff = Number(selection.endOffset);

        // 복원한 시작노드, 종료 노드 기준으로 range 복원
        range.setStart(startNode, startOff);
        range.setEnd(endNode, endOff);

        const newNode = document.createElement("span");
        newNode.style.backgroundColor = highlightColor;
        range.surroundContents(newNode);
      }
    }
  );
}

function onWindowReady() {
  // 버튼 만들어 놓기
  const body = document.querySelector("body");

  let penButton = `<input id="btn_highlighters" type="image" src="https://cdn-icons-png.flaticon.com/512/3237/3237124.png"
  height = "35" width="35">`;

  body.innerHTML += penButton;

  const button = document.getElementById("btn_highlighters");
  button.style.display = "none";
  button.addEventListener("click", highlight);

  // 하이라이트 가져오기
  getHighlight(window.location.href);
}

const url_check =
  window.location.href !== `http://localhost:3000/` &&
  window.location.href !== `https://highlighters.site/` &&
  window.location.href !== `http://localhost:5555/`;

/* contentscript 시작 */
if (url_check) {
  window.onload = onWindowReady;

  // 드래그하고 마우스를 떼면 selection 객체 생성
  document.onmouseup = function (e) {
    const button = document.getElementById("btn_highlighters");
    const sel = document.getSelection();

    if (sel.isCollapsed || sel.toString() === highlightStr) {
      button.style.display = "none";
      return;
    } //
    else {
      selectionText = sel;
      highlightStr = sel.toString();

      // 드래그한 영역의 위치를 가져온다.
      const direction = sel.anchorOffset - sel.focusOffset < 0;
      const divTop = direction ? e.pageY + 10 : e.pageY - 40;
      const divLeft = direction ? e.pageX + 10 : e.pageX - 40;
      button.style.transform = direction ? "rotate(90deg)" : "rotate(270deg)";

      // 드래그한 영역의 위치에 레이어를 띄운다.
      // 레이어의 위치를 변경하고 싶으면 위치값을 수정한다.
      // 레이어가 화면을 벗어나면 안되므로 위치값을 수정한다.

      // 레이어 위치를 변경한다.
      // let button = document.getElementById("btn_highlighters");
      button.style.top = divTop + "px";
      button.style.left = divLeft + "px";
      button.style.position = "absolute";
      button.style.display = "block";
      button.style.zIndex = "2147483647";
    }
  };
}
