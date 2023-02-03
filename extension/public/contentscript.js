let selectionText;
let selectedImage = null;
let highlightStr = "null";
let highlightColor;
let highlights = [];
let userImage;
let curNode;
let curNodeType;

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

const pen_purple =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbhTyoz%2FbtrWYMqgMN8%2F1auPxBjwj2dcxtiQ4qTNP1%2Fimg.png";
const pen_blue =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbSTxN4%2FbtrWS3s6Nny%2FUAwdw2EdlUzkfEp6ZOxLM0%2Fimg.png";
const pen_yellow =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcwmKe7%2FbtrWZXkQKtl%2FVVl4FYkjMUQfhzT6EBJSt0%2Fimg.png";
const pen_green =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbuwOGM%2FbtrWX5pUxf0%2Faa9V7hS48VqJgeKrNjLykK%2Fimg.png";
const pen_red =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcDpb7P%2FbtrWREgrRTF%2FwcDFX51rqGcVThfEJyLXgK%2Fimg.png";

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

function highlightSingleNode(node, highlight, startOffset, endOffset) {
  const id = highlight.id;
  const highlighterImage = highlight.user ? highlight.user.image : userImage;
  const color = highlight.color;

  const newrange = document.createRange();
  newrange.setStart(node, startOffset);
  newrange.setEnd(node, endOffset);

  const newNode = document.createElement("highlight");
  newNode.setAttribute("class", id);
  newrange.surroundContents(newNode);

  if (color !== -1) {
    newNode.style.backgroundColor = color;
    newNode.addEventListener("click", (event) =>
      showToolBar(event, newNode, highlighterImage, 1)
    );
  }
}

function highlightManyNode(highlight, rangeobj) {
  const startNode = rangeobj.startNode;
  const endNode = rangeobj.endNode;
  const startOffset = rangeobj.startOffset;
  const endOffset = rangeobj.endOffset;

  const startXpath = makeXPath(startNode).split("/");
  const endXpath = makeXPath(endNode).split("/");

  let commonxpath = [];
  for (let i = 0; startXpath[i] === endXpath[i]; i++) {
    if (startXpath[i] === undefined) break;
    commonxpath.push(startXpath[i]);
  }

  const commonNode = document.evaluate(
    commonxpath.join("/"),
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  // 공통조상 노드의 자식노드부터 DFS로 탐색
  const childs = [...commonNode.childNodes];
  const stk = [];
  while (childs.length !== 0) {
    stk.push(childs.pop());
  }

  let flag = 0;
  while (stk.length !== 0) {
    const current = stk.pop();
    const length = current.textContent.length;

    // 시작노드 발견
    if (current === startNode) {
      highlightSingleNode(current, highlight, startOffset, length);
      flag = 1;
    }
    // 끝노드 발견
    else if (current === endNode) {
      highlightSingleNode(current, highlight, 0, endOffset);
      break;
    }
    // 다른 노드
    else {
      const curchilds = [...current.childNodes];

      // 시작노드와 끝노드 사이의 리프노드
      if (flag && curchilds.length === 0) {
        highlightSingleNode(current, highlight, 0, length);
      }

      while (curchilds.length !== 0) {
        stk.push(curchilds.pop());
      }
    }
  }
}

function rehighlightText(highlight) {
  const selection = highlight.selection;

  // 시작 노드 복원
  const startNode = document.evaluate(
    selection.startXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  const startOffset = Number(selection.startOffset);

  // 종료 노드 복원
  const endNode = document.evaluate(
    selection.endXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  const endOffset = Number(selection.endOffset);

  const rangeobj = { startNode, endNode, startOffset, endOffset };

  /* 시작노드와 종료노드가 다른 경우 */
  console.log("highlight", highlight);

  if (startNode !== endNode) {
    highlightManyNode(highlight, rangeobj);
  } else {
    highlightSingleNode(startNode, highlight, startOffset, endOffset);
  }
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
  img.classList.add("highlighted");

  // 툴바 표시 이벤트리스너 추가
  img.addEventListener("click", (event) =>
    showToolBar(event, img, highlight.user.image, 2)
  );
}

/* 하이라이트 Post */
async function postHighlight(range, highlightStr) {
  const highlightColorInSync = await chrome.storage.sync.get("highlightColor");
  highlightColor = highlightColorInSync.highlightColor;

  const uri = window.location.href;
  const decodeuri = decodeURI(uri);

  const rangeobj = {
    startXPath: makeXPath(range.startContainer),
    endXPath: makeXPath(range.endContainer),
    startOffset: range.startOffset,
    endOffset: range.endOffset,
  };

  const ogImageNode = document.querySelector("meta[property='og:image']");
  const ogDescNode = document.querySelector("meta[property='og:description']");

  const ogImage = ogImageNode
    ? ogImageNode.content
    : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png";
  const ogDesc = ogDescNode ? ogDescNode.content : "No Description";

  chrome.runtime.sendMessage(
    {
      greeting: "postHighlight",
      data: {
        url: decodeuri,
        contents: highlightStr,
        selection: rangeobj,
        title: document.title,
        image: ogImage,
        description: ogDesc,
        color: highlightColor,
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
      }
      // postHighlight 성공
      else {
        const highlight = response.data.data;

        highlights.push(highlight);
        rehighlightText(highlight);

        // 펜 버튼 숨기기
        const button = document.getElementById("btn_text_highlighters");
        button.style.display = "none";
      }
    }
  );
}

function deleteHighlight(node) {
  const nodeId = node.classList[0];

  chrome.runtime.sendMessage(
    {
      greeting: "deleteHighlight",
      data: { id: +nodeId, type: curNodeType },
    },
    (response) => {
      if (curNodeType === 1) {
        const NodeList = document.querySelectorAll(`highlight`);
        NodeList.forEach((nodeInList) => {
          if (nodeInList.className === nodeId) {
            // 배경색 및 메뉴바 이벤트리스너 지우기
            nodeInList.removeAttribute("style");
            const deletedTextNode = nodeInList.cloneNode(true);
            nodeInList.parentNode.replaceChild(deletedTextNode, nodeInList);
          }
        });
      } else if (curNodeType === 2) {
        // 배경색 및 메뉴바 이벤트리스너 지우기
        node.removeAttribute("style");
        const deletedImageNode = node.cloneNode(true);
        node.parentNode.replaceChild(deletedImageNode, node);

        // 이미지 하이라이터 버튼 복원하기
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
  // curNodeID = nodeID; // 현재 선택된 하이라이트 노드 아이디 업데이트
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
        color: highlightColor,
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
        highlightedImage.style.border = `8px solid ${highlightColor}`;
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

function makeButton(name, penImage) {
  const button = document.createElement("input");
  button.setAttribute("id", `btn_${name}_highlighters`);
  button.setAttribute("type", "image");

  console.log(highlightColor);
  button.src = penImage;
  button.style.height = "35px";
  button.style.width = "35px";
  button.style.display = "none";
  // button.style.transform = "rotate(270deg)"

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

  const highlightColorInSync = await chrome.storage.sync.get("highlightColor");
  highlightColor = highlightColorInSync.highlightColor;

  let pen_src;
  switch (highlightColor) {
    case "#e9d5ff":
      pen_src = pen_purple;
      break;
    case "#bfdbfe":
      pen_src = pen_blue;
      break;
    case "#bbf7d0":
      pen_src = pen_green;
      break;
    case "#fecaca":
      pen_src = pen_red;
      break;
    default:
      pen_src = pen_yellow;
      break;
  }

  const html = document.querySelector("html");

  const textPenButton = makeButton("text", pen_src);
  const imagePenButton = makeButton("image", pen_src);
  const toolBar = makeToolBar();

  textPenButton.addEventListener("click", highlight);
  imagePenButton.addEventListener("click", highlightImage);
  imagePenButton.addEventListener("mouseover", () => {
    imagePenButton.style.display = "block";
  });

  html.appendChild(textPenButton);
  html.appendChild(imagePenButton);
  html.appendChild(toolBar);

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
    button.style.transform = direction ? "rotate(0deg)" : "rotate(180deg)";

    // 레이어 위치를 변경한다.
    button.style.top = divTop + "px";
    button.style.left = divLeft + "px";
    button.style.position = "absolute";
    button.style.display = "block";
    button.style.zIndex = "2147483647";
  }
};

let youtubeLeftControls, youtubePlayer;
let currentVideo = "";
let currentVideoBookmarks = [];

const getBookmark = async (videoID) => {
  const youtubeURL = `https://www.youtube.com/watch?v=${videoID}`;

  return await chrome.runtime.sendMessage({
    greeting: "getHighlight",
    data: {
      url: youtubeURL,
    },
  });
};

const postBookmark = async (videoID, time) => {
  const youtubeURL = `https://www.youtube.com/watch?v=${videoID}`;
  const highlightColorInSync = await chrome.storage.sync.get("highlightColor");
  highlightColor = highlightColorInSync.highlightColor;

  const og_image = document.querySelector("meta[property='og:image']");
  const og_description = document.querySelector(
    "meta[property='og:description']"
  );

  return await chrome.runtime.sendMessage({
    greeting: "postHighlight",
    data: {
      url: youtubeURL,
      contents: String(time),
      selection: {},
      title: document.title,
      image: og_image
        ? og_image.content
        : "https://www.salonlfc.com/wp-content/uploads/2018/01/image-not-found-1-scaled-1150x647.png",
      description: og_description ? og_description.content : "No Description",
      color: highlightColor,
      type: 3,
    },
  });
};

const newVideoLoaded = async () => {
  const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
  const response = await getBookmark(currentVideo);
  currentVideoBookmarks = response.data.success ? response.data.data : [];
  console.log("currentVideoBookmarks", currentVideoBookmarks);

  if (!bookmarkBtnExists) {
    const bookmarkBtn = document.createElement("img");

    bookmarkBtn.src = "https://cdn-icons-png.flaticon.com/512/3237/3237124.png";
    bookmarkBtn.className = "ytp-button bookmark-btn";
    bookmarkBtn.title = "Click to bookmark current timestamp";
    bookmarkBtn.style.margin = "10px";
    bookmarkBtn.style.height = "25px";
    bookmarkBtn.style.width = "25px";

    youtubeLeftControls =
      document.getElementsByClassName("ytp-left-controls")[0];
    youtubePlayer = document.getElementsByClassName("video-stream")[0];

    youtubeLeftControls.appendChild(bookmarkBtn);
    bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
  }
};

const addNewBookmarkEventHandler = async () => {
  console.log("CLICKED");

  const getResponse = await getBookmark(currentVideo);
  currentVideoBookmarks = getResponse.data.data;

  const postResponse = await postBookmark(
    currentVideo,
    youtubePlayer.currentTime
  );
  console.log("postResponse", postResponse);

  const newHighlight = postResponse.data.data;
  console.log("newHighlight", newHighlight);
  rehighlightVideo(newHighlight);
};

const deletePin = (pinNode) => {
  pinNode.remove();

  chrome.runtime.sendMessage(
    {
      greeting: "deleteHighlight",
      data: {
        id: +pinNode.id,
        type: 3,
      },
    },
    (response) => {
      console.log("response", response);
    }
  );
};

const pin_purple =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fct9HWv%2FbtrWYMjgfIU%2FkWRkV0XxdK3ZrCBsKDIxZ0%2Fimg.png";
const pin_blue =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FAjfN3%2FbtrWVLE84GJ%2F54753KmbOyk5Bggf3Pkk80%2Fimg.png";
const pin_green =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FoBPPZ%2FbtrWXj2HIdl%2FHQ6f0fdXfNaSxizb4n13R1%2Fimg.png";
const pin_red =
  "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fbb0RVh%2FbtrWRdDfJHx%2F9hsXVykGBMIpijZ5uufajK%2Fimg.png";
const pin_yellow = "https://cdn-icons-png.flaticon.com/512/787/787552.png";

const rehighlightVideo = (highlight) => {
  const progressBar = document.getElementsByClassName(
    "ytp-progress-bar-container"
  )[0];

  const highlightYTP = document.createElement("highlighters");
  highlightYTP.id = highlight.id;
  highlightYTP.className = "highlighters-ytp";
  highlightYTP.setAttribute("data-time", parseInt(highlight.contents));
  highlightYTP.style.position = "absolute";

  const barPos = (parseInt(highlight.contents) / youtubePlayer.duration) * 100;
  highlightYTP.style.left = `${barPos}%`;
  // highlightYTP.style.height = "100%";
  // highlightYTP.style.width = "4px";
  // highlightYTP.style.backgroundColor = highlight.color;
  // highlightYTP.style.cursor = "pointer";
  // highlightYTP.style.zIndex = "2147483647";

  let pin_src;
  switch (highlight.color) {
    case "#e9d5ff":
      pin_src = pin_purple;
      break;
    case "#bfdbfe":
      pin_src = pin_blue;
      break;
    case "#bbf7d0":
      pin_src = pin_green;
      break;
    case "#fecaca":
      pin_src = pin_red;
      break;

    default:
      pin_src = pin_yellow;
      break;
  }

  const pin = document.createElement("img");
  pin.src = pin_src;
  pin.style.position = "absolute";
  pin.style.top = "-25px";
  pin.style.left = "-11px";
  pin.style.height = "25px";
  pin.style.width = "25px";

  highlightYTP.appendChild(pin);
  progressBar.appendChild(highlightYTP);

  highlightYTP.addEventListener("click", () => deletePin(highlightYTP));
};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  switch (request.greeting) {
    case "getHighlight":
      const highlights = request.data ? request.data : [];
      console.log("[cs] getHighlight", highlights);

      const progressBarContainer = document.querySelector(
        ".ytp-progress-bar-container"
      );

      if (progressBarContainer) {
        const previous_pins =
          progressBarContainer.querySelectorAll(".highlighters-ytp");

        for (let i = 0; i < previous_pins.length; i++) {
          progressBarContainer.removeChild(previous_pins[i]);
        }
      }

      for (const highlight of highlights) {
        try {
          if (highlight.type === 1) rehighlightText(highlight);
          else if (highlight.type === 2) rehighlightImage(highlight);
          else if (highlight.type === 3) rehighlightVideo(highlight);
        } catch (e) {
          console.log("하이라이트 복원 실패", e);
        }
      }

      makeEventOnImage();
      sendResponse({ farewell: "good" });
      break;

    case "newVideo":
      currentVideo = request.videoID;
      console.log("currentVideo", currentVideo);
      newVideoLoaded();
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
      break;

    case "changeCurrentColor":
      console.log("[contentscript]: changeCurrentColor: ", request.data);
      const textPenButton = document.getElementById("btn_text_highlighters");
      const imagePenButton = document.getElementById("btn_image_highlighters");

      let pen_src;
      switch (request.data) {
        case "#e9d5ff":
          pen_src = pen_purple;
          break;
        case "#bfdbfe":
          pen_src = pen_blue;
          break;
        case "#bbf7d0":
          pen_src = pen_green;
          break;
        case "#fecaca":
          pen_src = pen_red;
          break;
        default:
          pen_src = pen_yellow;
          break;
      }

      textPenButton.src = pen_src;
      imagePenButton.src = pen_src;
      sendResponse({ response: "ok" });
      break;
    // try {

    // }

    default:
      console.log(request, sender);
      break;
  }
  return true;
});
