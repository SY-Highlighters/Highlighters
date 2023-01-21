let selectionText;
let selectedImage = null;
let highlightStr = "null";
let highlightColor;
let highlights = [];
let userImage;
let curNode;
let curNodeType;
let curNodeID = null;
// let mouseOverImgButton = {};

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

async function highlightDone(range, id) {
  console.log("highlightdone: ", id);

  if (range.startContainer !== range.endContainer) {
    const startxpath = makeXPath(range.startContainer);
    const endxpath = makeXPath(range.endContainer);
    const startxpatharray = startxpath.split("/");
    const endxpatharray = endxpath.split("/");

    let commonxpath = [];
    for (let i = 0; startxpatharray[i] === endxpatharray[i]; i++) {
      commonxpath.push(startxpatharray[i]);
    }

    const commonxpathstr = commonxpath.join("/");

    const commonnode = document.evaluate(
      commonxpathstr,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    const childs = [...commonnode.childNodes];

    const stk = [];
    while (childs.length !== 0) {
      stk.push(childs.pop());
    }

    let flag = 0;
    while (stk.length !== 0) {
      const current = stk.pop();
      if (current === range.startContainer) {
        const newrange = document.createRange();
        newrange.setStart(current, range.startOffset);
        newrange.setEnd(current, current.textContent.length);
        const newNode = document.createElement("highlight");
        newNode.setAttribute("class", id);
        // newNode.setAttribute("id", id);
        newNode.style.backgroundColor = highlightColor.highlightColor;
        newrange.surroundContents(newNode);
        newNode.addEventListener("click", (event) =>
          showToolBar(event, newNode, userImage, 1)
        );
        flag = 1;
      } else if (current === range.endContainer) {
        const newrange = document.createRange();
        newrange.setStart(current, 0);
        newrange.setEnd(current, range.endOffset);
        const newNode = document.createElement("highlight");
        newNode.setAttribute("class", id);
        // newNode.setAttribute("id", id);
        newNode.style.backgroundColor = highlightColor.highlightColor;
        newrange.surroundContents(newNode);
        newNode.addEventListener("click", (event) =>
          showToolBar(event, newNode, userImage, 1)
        );
        break;
      } else {
        const curchilds = [...current.childNodes];
        if (flag && curchilds.length === 0) {
          const newrange = document.createRange();
          newrange.setStart(current, 0);
          newrange.setEnd(current, current.textContent.length);
          const newNode = document.createElement("highlight");
          newNode.setAttribute("class", id);
          // newNode.setAttribute("id", id);
          newNode.style.backgroundColor = highlightColor.highlightColor;
          newrange.surroundContents(newNode);
          newNode.addEventListener("click", (event) =>
            showToolBar(event, newNode, userImage, 1)
          );
        }
        while (curchilds.length !== 0) {
          stk.push(curchilds.pop());
        }
      }
    }
  } else {
    //하이라이팅
    const newNode = document.createElement("highlight");
    newNode.setAttribute("class", id);
    // newNode.setAttribute("id", id);
    newNode.style.backgroundColor = highlightColor.highlightColor;
    range.surroundContents(newNode);
    // 툴바표시 이벤트리스너 추가
    newNode.addEventListener("click", (event) =>
      showToolBar(event, newNode, userImage, 1)
    );
  }

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

  console.log("rangeobj: ", rangeobj);

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
        alert(
          "Highlighters: 로그인이 필요한 서비스입니다.\n(확인을 누르면 웹사이트로 이동합니다)"
        );
        window.open("https://highlighters.site/");
      } else {
        console.log(response);
        highlights.push(response.data.data);
        highlightDone(range, response.data.data.id);
      }
    }
  );
}

function rehighlightText(highlight) {
  const selection = highlight.selection;

  // console.log(selection);
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

  if (startNode !== endNode) {
    // console.log("1");
    const startxpath = selection.startXPath;
    const endxpath = selection.endXPath;
    const startxpatharray = startxpath.split("/");
    const endxpatharray = endxpath.split("/");

    let commonxpath = [];
    for (let i = 0; startxpatharray[i] === endxpatharray[i]; i++) {
      commonxpath.push(startxpatharray[i]);
    }

    const commonxpathstr = commonxpath.join("/");

    const commonnode = document.evaluate(
      commonxpathstr,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;

    const childs = [...commonnode.childNodes];

    // console.log(childs);

    const stk = [];
    while (childs.length !== 0) {
      stk.push(childs.pop());
    }

    let flag = 0;
    while (stk.length !== 0) {
      const current = stk.pop();
      if (current === startNode) {
        const newrange = document.createRange();
        newrange.setStart(current, startOff);
        newrange.setEnd(current, current.textContent.length);
        const newNode = document.createElement("highlight");
        newNode.setAttribute("class", highlight.id);
        // newNode.setAttribute("id", highlight.id);
        if (highlight.color === "-1") {
          // 색상이 없는 경우 style과 eventListener를 지워준다.
          newNode.removeAttribute("style");
          newrange.surroundContents(newNode);
        } else {
          newNode.style.backgroundColor = highlight.color;
          newrange.surroundContents(newNode);
          newNode.addEventListener("click", (event) =>
            showToolBar(event, newNode, highlight.user.image, 1)
          );
        }
        flag = 1;
      } else if (current === endNode) {
        const newrange = document.createRange();
        newrange.setStart(current, 0);
        newrange.setEnd(current, endOff);
        const newNode = document.createElement("highlight");
        newNode.setAttribute("class", highlight.id);
        // newNode.setAttribute("id", highlight.id);
        if (highlight.color === "-1") {
          // 색상이 없는 경우 style과 eventListener를 지워준다.
          newNode.removeAttribute("style");
          newrange.surroundContents(newNode);
        } else {
          newNode.style.backgroundColor = highlight.color;
          newrange.surroundContents(newNode);
          newNode.addEventListener("click", (event) =>
            showToolBar(event, newNode, highlight.user.image, 1)
          );
        }
        break;
      } else {
        const curchilds = [...current.childNodes];
        if (flag && curchilds.length === 0) {
          const newrange = document.createRange();
          newrange.setStart(current, 0);
          newrange.setEnd(current, current.textContent.length);
          const newNode = document.createElement("highlight");
          newNode.setAttribute("class", highlight.id);
          // newNode.setAttribute("id", highlight.id);
          if (highlight.color === "-1") {
            // 색상이 없는 경우 style과 eventListener를 지워준다.
            newNode.removeAttribute("style");
            newrange.surroundContents(newNode);
          } else {
            newNode.style.backgroundColor = highlight.color;
            newrange.surroundContents(newNode);
            newNode.addEventListener("click", (event) =>
              showToolBar(event, newNode, highlight.user.image, 1)
            );
          }
        }
        while (curchilds.length !== 0) {
          stk.push(curchilds.pop());
        }
      }
    }
  } else {
    //하이라이팅
    // console.log("2");

    range.setStart(startNode, startOff);
    range.setEnd(endNode, endOff);
    const newNode = document.createElement("highlight");
    newNode.setAttribute("class", highlight.id);
    // newNode.setAttribute("id", highlight.id);
    if (highlight.color === "-1") {
      // 색상이 없는 경우 style과 eventListener를 지워준다.
      newNode.removeAttribute("style");
      range.surroundContents(newNode);
    } else {
      newNode.style.backgroundColor = highlight.color;
      range.surroundContents(newNode);
      newNode.addEventListener("click", (event) =>
        showToolBar(event, newNode, highlight.user.image, 1)
      );
    }
  }

  // // 하이라이팅
  // const newNode = document.createElement("span");
  // newNode.setAttribute("class", "highlighter");
  // newNode.setAttribute("id", highlight.id);
  // newNode.style.backgroundColor = highlight.color;
  // range.surroundContents(newNode);

  // // 툴바 표시 이벤트리스너 추가
  // newNode.addEventListener("click", (event) =>
  //   showToolBar(event, newNode, highlight.user.image, 1)
  // );
}

function rehighlightImage(highlight) {
  // 이미지 노드 복원
  const img = document.evaluate(
    highlight.selection.XPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  // 하이라이팅
  img.style.border = `8px solid ${highlight.color}`;
  img.setAttribute("class", highlight.id);
  // img.setAttribute("id", highlight.id);
  img.classList.add("highlighted");

  // 툴바 표시 이벤트리스너 추가
  img.addEventListener("click", (event) =>
    showToolBar(event, img, highlight.user.image, 2)
  );
}

function deleteHighlight(node) {
  const nodeclass = curNodeID == null ? node.className : curNodeID;
  console.log(node.classList);
  const nodeId = node.classList[0];

  chrome.runtime.sendMessage(
    {
      greeting: "deleteHighlight",
      data: { id: +nodeId, type: curNodeType },
    },
    (response) => {
      if (curNodeType === 1) {
        const NodeList = document.querySelectorAll(`highlight`);
        console.log(NodeList);
        NodeList.forEach((nodeInList) => {
          if (nodeInList.className === nodeId) {
            nodeInList.removeAttribute("style");
            const deletedTextNode = nodeInList.cloneNode(true);
            nodeInList.parentNode.replaceChild(deletedTextNode, nodeInList);
          }
        });
      } else if (curNodeType === 2) {
        node.removeAttribute("style");
        const deletedImageNode = node.cloneNode(true);
        node.parentNode.replaceChild(deletedImageNode, node);
        const button = document.getElementById("btn_image_highlighters");

        const position = deletedImageNode.getBoundingClientRect();

        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        const mouseOverImgBtn = mouseOverImgBtnHandler(
          button,
          deletedImageNode,
          position,
          scrollY,
          scrollX
        );
        deletedImageNode.addEventListener("mouseover", mouseOverImgBtn);
        deletedImageNode.addEventListener("mouseout", mouseOnImgBtn);
      }
    }
  );

  hideToolBar();
}

function showToolBar(event, node, user, nodetype, nodeID) {
  const html = document.querySelector("html");
  const userImageDiv = document.getElementById("userImageDiv-highlighters");
  const toolBar = document.getElementById("toolBar-highlighters");

  curNode = node; // 현재 선택된 하이라이트 업데이트
  curNodeType = nodetype; // 현재 선택된 하이라이트 노드 타입 업데이트
  curNodeID = nodeID; // 현재 선택된 하이라이트 노드 아이디 업데이트
  userImageDiv.setAttribute("src", user); // 현재 선택된 하이라이트의 유저 이미지로 설정

  // 투명 배경 : 툴바 바깥 눌렀을 때 툴바가 닫히도록 이벤트 리스너 추가
  const background = document.createElement("div");
  background.setAttribute("id", "background-highlighters");
  background.style.cssText = backgroundCSS;
  background.addEventListener("click", hideToolBar);
  html.appendChild(background);

  // 툴바의 위치를 마우스 이벤트가 발생한 곳으로 설정
  const divTop = event.pageY - 50;
  const divLeft = event.pageX - 40;

  // 툴바 스타일 설정
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
      userImage = response.data.image;
    }
  );
}

const mouseOverImgBtnHandler =
  (button, image, position, scrollY, scrollX) => () => {
    button.style.top = position.top + scrollY + 10 + "px";
    button.style.left = position.left + scrollX + 10 + "px";
    button.style.transform = "rotate(270deg)";
    button.style.zIndex = "2147483647";
    button.style.display = "block";
    button.style.position = "absolute";

    selectedImage = image;
  };

const mouseOnImgBtn = () => {
  const button = document.getElementById("btn_image_highlighters");
  button.style.display = "none";
};

function makeEventOnImage() {
  const button = document.getElementById("btn_image_highlighters");
  const images = document.querySelectorAll("img");

  for (const image of images) {
    // console.log(image.classList);
    if (image.classList.contains("highlighted")) {
      continue;
    }

    const position = image.getBoundingClientRect();

    if (position.height > 150 || position.width > 150) {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      const mouseOverImgBtn = mouseOverImgBtnHandler(
        button,
        image,
        position,
        scrollY,
        scrollX
      );
      image.addEventListener("mouseover", mouseOverImgBtn);
      image.addEventListener("mouseout", mouseOnImgBtn);
    }
  }
}

function highlightImage() {
  const uri = window.location.href;
  const decodeuri = decodeURI(uri);

  const rangeObject = {
    XPath: makeXPath(selectedImage),
  };

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
        alert(
          "Highlighters: 로그인이 필요한 서비스입니다.\n(확인을 누르면 웹사이트로 이동합니다)"
        );
        window.open("https://highlighters.site/");
      } else {
        console.log("Post Highlight Image Success", response.data);
        highlights.push(response.data.data);

        const curId = response.data.data.id; // 현재 선택된 이미지 노드아이디 백업
        console.log(curId);

        // 이벤트리스너(하이라이트 버튼) 없애기
        const highlightedImage = selectedImage.cloneNode(true);
        highlightedImage.style.border = `8px solid ${highlightColor.highlightColor}`;
        selectedImage.parentNode.replaceChild(highlightedImage, selectedImage);
        selectedImage = highlightedImage;

        // 툴바 표시 이벤트리스너 추가
        highlightedImage.addEventListener("click", (event) =>
          showToolBar(event, highlightedImage, userImage, 2, curId)
        );

        // 펜 버튼 숨기기
        const ImageButton = document.getElementById("btn_image_highlighters");
        ImageButton.style.display = "none";
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
  if (
    window.location.href === "https://highlighters.site/" ||
    window.location.href === "http://localhost:3000/"
  ) {
    return;
  }

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
  getUserInfo();
}
//
/* contentscript 시작 */
window.onload = onWindowReady;

// 드래그하고 마우스를 떼면 selection 객체 생성
document.onmouseup = function (e) {
  if (
    window.location.href === "https://highlighters.site/" ||
    window.location.href === "http://localhost:3000/"
  ) {
    return;
  }
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
    case "getHighlight":
      const highlights = request.data ? request.data : [];
      console.log("[cs] getHighlight", highlights);

      for (const highlight of highlights) {
        try {
          if (highlight.type === 1) rehighlightText(highlight);
          else if (highlight.type === 2) rehighlightImage(highlight);
        } catch (e) {
          console.log("하이라이트 복원 실패", e);
        }
      }

      makeEventOnImage();
      sendResponse({ farewell: "good" });
      break;

    // 웹페이지의 하이라이팅을 디비로 전송
    case "getOG":
      const ogTitle = document.querySelector("meta[property = 'og:title']");
      const title =
        document.title == null && ogTitle !== ""
          ? ogTitle.content
          : document.title;
      const ogImage = document.querySelector("meta[property='og:image']");
      const image =
        ogImage != null
          ? ogImage.content
          : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png";
      const ogDescription = document.querySelector(
        "meta[property='og:description']"
      );
      const description = ogDescription != null ? ogDescription.content : "";

      console.log(title, image, description);
      sendResponse({
        title: title,
        image: image,
        description: description,
      });
      break;

    case "realtimehighlight": // 웹소켓으로 넘겨받은 데이터로 하이라이팅 치기 (db에 저장하지는 않음)
      console.log("[contentscript]: realtimehighlight: ", request);
      try {
        if (request.data.type === 1) rehighlightText(request.data);
        else if (request.data.type === 2) rehighlightImage(request.data);
      } catch (e) {
        console.log("하이라이트 복원 실패", e);
      }
      // rehighlightText(request.data);
      break;

    default:
      console.log(request, sender);
      break;
  }
  return true;
});
