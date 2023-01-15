/* 코드시작 */
let selectionText;
let highlightStr = "null";
let highlightColor;
let highlights;
let userImage;
let curNode;

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

const toolBarCSS = `
    width: 111px !important;
    height: 40px !important;
    align-items: center !important;
    background-color: #fff !important;
    border: 1px solid #f2f2f2 !important;
    box-sizing: border-box !important;
    box-shadow: 0px 3px 8px rgb(0 0 0 / 20%) !important;
    border-radius: 8px !important;
    display: none`;

const backgroundCSS = `
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(255, 255, 255, 0);
    z-index: 999;
`;

function highlight() {
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
  const button = document.getElementById("btn_text_highlighters");
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

  body.style.overflow = "hidden";
}

async function highlightDone(range, id) {
  const newNode = document.createElement("span");
  newNode.setAttribute("class", `highlighter`);
  newNode.setAttribute("id", id);
  newNode.style.backgroundColor = highlightColor.highlightColor;
  range.surroundContents(newNode);
  newNode.addEventListener("click", (event) =>
    showToolBar(event, newNode, userImage)
  );

  // 펜 버튼 숨기기
  const button = document.getElementById("btn_text_highlighters");
  button.style.display = "none";
}

/* 하이라이트 Post */
async function postHighlight(range, highlightStr) {
  highlightColor = await chrome.storage.sync.get("highlightColor");
  const uri = window.location.href;
  const decodeuri = decodeURI(uri);

  const rangeobj = {
    startXPath: makeXPath(range.startContainer),
    startOffset: range.startOffset,
    endXPath: makeXPath(range.endContainer),
    endOffset: range.endOffset,
  };

  console.log("contentscript: posthighlight");

  const og_image = document.querySelector("meta[property='og:image']");
  const og_description = document.querySelector(
    "meta[property='og:description']"
  );

  chrome.runtime.sendMessage(
    {
      greeting: "postHighlight",
      data: {
        url: decodeuri,
        contents: highlightStr,
        selection: rangeobj,
        title: document.title,
        image: og_image
          ? og_image.content
          : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png",
        description: og_description ? og_description.content : "No Description",
        color: highlightColor.highlightColor,
        type: 1,
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
        console.log("Post Highlight Response", response.data);
        highlights.push(response.data.data);
        highlightDone(range, response.data.data.id);
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
    async (response) => {
      const highlightsMeta = response.data;

      highlights = highlightsMeta.data ? highlightsMeta.data : [];
      console.log(highlights);

      if (highlightsMeta.success === false) {
        throw new Error(
          `[${highlightsMeta.statusCode}] ${highlightsMeta.message}`
        );
      }

      for (const highlight of highlights) {
        try {
          if (highlight.type === 1) {
            rehighlightText(highlight);
          } else if (highlight.type === 2) {
            rehighlightImage(highlight);
          }
        } catch (e) {
          console.log("하이라이트 복원 실패", e);
        }
      }
    }
  );
}

function rehighlightText(highlight) {
  const selection = highlight.selection;
  const range = document.createRange();

  console.log("selection: ", selection);

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

  console.log("위치 복원", startNode, startOff, endNode, endOff);

  // 복원한 시작노드, 종료 노드 기준으로 range 복원
  range.setStart(startNode, startOff);
  range.setEnd(endNode, endOff);

  const newNode = document.createElement("span");
  newNode.setAttribute("class", "highlighter");
  newNode.setAttribute("id", highlight.id);
  newNode.style.backgroundColor = highlight.color;
  range.surroundContents(newNode);

  newNode.addEventListener("click", (event) =>
    showToolBar(event, newNode, highlight.user.image)
  );
}

function rehighlightImage(highlight) {
  const img = document.evaluate(
    highlight.selection.XPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  img.style.border = `8px solid ${highlight.color}`;
}

function deleteHighlight(node) {
  chrome.runtime.sendMessage(
    {
      greeting: "deleteHighlight",
      data: { id: +node.id },
    },
    (response) => {
      console.log(response);
      node.removeAttribute("style");
    }
  );

  hideToolBar();
}

function showToolBar(event, node, user) {
  console.log("showToolBar");
  const html = document.querySelector("html");
  const toolBar = document.getElementById("toolBar-highlighters");
  const userImageDiv = document.getElementById("userImageDiv-highlighters");

  curNode = node; // 현재 선택된 하이라이트 업데이트
  userImageDiv.setAttribute("src", user); // 현재 선택된 하이라이트의 유저 이미지로 설정

  const background = document.createElement("div");
  background.setAttribute("id", "background-highlighters");
  background.style.cssText = backgroundCSS;
  background.addEventListener("click", hideToolBar);
  html.appendChild(background);

  const divTop = event.pageY - 50;
  const divLeft = event.pageX - 40;
  toolBar.style.top = divTop + "px";
  toolBar.style.left = divLeft + "px";
  toolBar.style.position = "absolute";
  toolBar.style.display = "block";
  toolBar.style.zIndex = "1000";
}

function hideToolBar() {
  const toolBar = document.getElementById("toolBar-highlighters");
  const background = document.getElementById("background-highlighters");

  toolBar.style.display = "none";
  background.remove();
}

function getUserInfo() {
  chrome.runtime.sendMessage(
    {
      greeting: "getUserInfo",
    },
    (response) => {
      // console.log("getUserInfo", response);
      userImage = response.data.image;
      console.log(userImage);
    }
  );
}

let selectedImage = null;

function makeEventOnImage() {
  const button = document.getElementById("btn_image_highlighters");
  const images = document.querySelectorAll("img");

  for (const image of images) {
    const position = image.getBoundingClientRect();

    if (position.height > 150 || position.width > 150) {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // eslint-disable-next-line no-loop-func
      image.addEventListener("mouseover", () => {
        console.log(position.top);

        button.style.top = position.top + scrollY + 10 + "px";
        button.style.left = position.left + scrollX + 10 + "px";
        button.style.transform = "rotate(270deg)";
        button.style.zIndex = "2147483647";
        button.style.display = "block";
        button.style.position = "absolute";

        selectedImage = image;
        // console.log("selectedImage", selectedImage);
      });

      image.addEventListener("mouseout", () => {
        button.style.display = "none";
      });
    }
  }
}

function highlightImage() {
  const uri = window.location.href;
  const decodeuri = decodeURI(uri);

  selectedImage.style.border = `8px solid ${highlightColor.highlightColor}`;

  const rangeObject = {
    XPath: makeXPath(selectedImage),
  };

  console.log("rangeObject", rangeObject);

  chrome.runtime.sendMessage(
    {
      greeting: "postHighlight",
      data: {
        url: decodeuri,
        contents: selectedImage.src,
        selection: rangeObject,
        title: document.title,
        image: document.querySelector("meta[property='og:image']").content,
        description: document.querySelector("meta[property='og:description']")
          .content,
        color: highlightColor.highlightColor,
        type: 2,
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
        console.log("Post Highlight Image Success", response.data);
        highlights.push(response.data.data);
      }
    }
  );
}

function makeButton(name) {
  const button = document.createElement("input");
  button.setAttribute("id", `btn_${name}_highlighters`);
  button.setAttribute("type", "image");
  button.setAttribute(
    "src",
    "https://cdn-icons-png.flaticon.com/512/3237/3237124.png"
  );
  button.style.height = "35px";
  button.style.width = "35px";
  button.style.display = "none";

  return button;
}

function makeToolBar() {
  const rootDiv = document.createElement("div");
  rootDiv.setAttribute("id", "toolBar-highlighters");

  rootDiv.style.cssText = toolBarCSS;

  // 삭제버튼 삽입
  const userImageDiv = document.createElement("input");
  userImageDiv.setAttribute("type", "image");
  userImageDiv.setAttribute("id", "userImageDiv-highlighters");
  userImageDiv.setAttribute(
    "src",
    "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
  );
  userImageDiv.style.height = "22px";
  userImageDiv.style.width = "22px";
  userImageDiv.style.position = "relative";
  userImageDiv.style.top = "9px";
  userImageDiv.style.left = "10px";
  userImageDiv.style.borderRadius = "15px";

  // 삭제버튼 삽입
  const deleteButton = document.createElement("input");
  deleteButton.setAttribute("type", "image");
  deleteButton.setAttribute("id", "deleteButton-highlighters");
  deleteButton.setAttribute(
    "src",
    "https://cdn-icons-png.flaticon.com/512/484/484662.png"
  );
  deleteButton.style.height = "20px";
  deleteButton.style.width = "20px";
  deleteButton.style.position = "relative";
  deleteButton.style.top = "8px";
  deleteButton.style.left = "22px";
  deleteButton.addEventListener("click", () => deleteHighlight(curNode));

  // 홈버튼 삽입
  const homeButton = document.createElement("input");
  homeButton.setAttribute("type", "image");
  homeButton.setAttribute("id", "homeButton-highlighters");
  homeButton.setAttribute(
    "src",
    "https://cdn-icons-png.flaticon.com/512/1946/1946488.png"
  );
  homeButton.style.height = "20px";
  homeButton.style.width = "20px";
  homeButton.style.position = "relative";
  homeButton.style.top = "8px";
  homeButton.style.left = "35px";
  homeButton.addEventListener("click", () =>
    window.open("https://highlighters.site/")
  );

  rootDiv.appendChild(userImageDiv);
  rootDiv.appendChild(deleteButton);
  rootDiv.appendChild(homeButton);

  return rootDiv;
}

async function onWindowReady() {
  // 버튼 만들어 놓기
  const html = document.querySelector("html");

  const textPenButton = makeButton("text");
  const imagePenButton = makeButton("image");
  const toolBar = makeToolBar();

  textPenButton.addEventListener("click", highlight);
  imagePenButton.addEventListener("click", highlightImage);
  imagePenButton.addEventListener("mouseover", () => {
    imagePenButton.style.display = "block";
  });

  html.appendChild(textPenButton);
  html.appendChild(imagePenButton);
  html.appendChild(toolBar);

  highlightColor = await chrome.storage.sync.get("highlightColor");

  // 하이라이트 가져오기
  const uri = window.location.href;
  const decodeuri = decodeURI(uri);
  console.log("gethighlight: ", decodeuri);

  getUserInfo();
  // console.log(userImage);
  getHighlight(decodeuri);
  makeEventOnImage();
}
//
/* contentscript 시작 */
window.onload = onWindowReady;

// 드래그하고 마우스를 떼면 selection 객체 생성
document.onmouseup = function (e) {
  const button = document.getElementById("btn_text_highlighters");
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
    button.style.top = divTop + "px";
    button.style.left = divLeft + "px";
    button.style.position = "absolute";
    button.style.display = "block";
    button.style.zIndex = "2147483647";
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.greeting) {
    // 웹페이지의 하이라이팅을 디비로 전송
    case "getOG":
      sendResponse({
        title: document.title,
        image: document.querySelector("meta[property='og:image']").content,
        description: document.querySelector("meta[property='og:description']")
          .content,
      });
      break;

    default:
      console.log(request, sender);
      break;
  }
  return true;
});
