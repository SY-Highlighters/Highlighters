let selectionText;
let selectedImage = null;
let highlightStr = "null";
let highlightColor;
let userImage;
let curNode;
let curNodeType;

const blackList = [
  "https://highlighters.site/",
  "https://highlighters.site/#",
  "http://localhost:3000/",
];

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

function getUserImage() {
  chrome.runtime.sendMessage(
    {
      greeting: "getUserInfo",
    },
    (response) => {
      userImage = response.data.image;
    }
  );
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

  // ???????????? ????????? ?????????????????? DFS??? ??????
  const childs = [...commonNode.childNodes];
  const stk = [];
  while (childs.length !== 0) {
    stk.push(childs.pop());
  }

  let flag = 0;
  while (stk.length !== 0) {
    const current = stk.pop();
    const length = current.textContent.length;

    // ???????????? ??????
    if (current === startNode) {
      highlightSingleNode(current, highlight, startOffset, length);
      flag = 1;
    }
    // ????????? ??????
    else if (current === endNode) {
      highlightSingleNode(current, highlight, 0, endOffset);
      break;
    }
    // ?????? ??????
    else {
      const curchilds = [...current.childNodes];

      // ??????????????? ????????? ????????? ????????????
      if (flag && curchilds.length === 0) {
        highlightSingleNode(current, highlight, 0, length);
      }

      while (curchilds.length !== 0) {
        stk.push(curchilds.pop());
      }
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
          "Highlighters: ???????????? ????????? ??????????????????.\n(????????? ????????? ??????????????? ???????????????)"
        );
        window.open("https://highlighters.site/");
      } else {
        const highlight = response.data.data;

        // ??????????????????(??????????????? ??????) ?????????
        const highlightedImage = selectedImage.cloneNode(true);
        highlightedImage.style.border = `8px solid ${highlightColor}`;
        selectedImage.parentNode.replaceChild(highlightedImage, selectedImage);
        selectedImage = highlightedImage;

        // ?????? ?????? ?????????????????? ??????
        highlightedImage.addEventListener("click", (event) =>
          showToolBar(event, highlightedImage, userImage, 2)
        );

        // ??? ?????? ?????????
        const ImageButton = document.getElementById("btn_image_highlighters");
        ImageButton.style.display = "none";
      }
    }
  );
}

function rehighlightText(highlight) {
  const selection = highlight.selection;

  // ?????? ?????? ??????
  const startNode = document.evaluate(
    selection.startXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  const startOffset = Number(selection.startOffset);

  // ?????? ?????? ??????
  const endNode = document.evaluate(
    selection.endXPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  const endOffset = Number(selection.endOffset);

  const rangeobj = { startNode, endNode, startOffset, endOffset };

  /* ??????????????? ??????????????? ?????? ?????? */
  if (startNode !== endNode) {
    highlightManyNode(highlight, rangeobj);
  } else {
    highlightSingleNode(startNode, highlight, startOffset, endOffset);
  }
}

function rehighlightImage(highlight) {
  // ????????? ?????? ??????
  const img = document.evaluate(
    highlight.selection.XPath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;

  // ???????????????
  img.style.border = `8px solid ${highlight.color}`;
  img.setAttribute("class", highlight.id);
  img.classList.add("highlighted");

  // ?????? ?????? ?????????????????? ??????
  img.addEventListener("click", (event) =>
    showToolBar(event, img, highlight.user.image, 2)
  );
}

async function postHighlight() {
  const highlightColorInSync = await chrome.storage.sync.get("highlightColor");
  highlightColor = highlightColorInSync.highlightColor;

  const uri = window.location.href;
  const decodeuri = decodeURI(uri);

  const range = selectionText.getRangeAt(0);
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
          "Highlighters: ???????????? ????????? ??????????????????.\n(????????? ????????? ??????????????? ???????????????)"
        );
        window.open("https://highlighters.site/");
      }
      // postHighlight ??????
      else {
        const highlight = response.data.data;
        rehighlightText(highlight);

        // ??? ?????? ?????????
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
        const highlightList = document.querySelectorAll(`highlight`);

        for (const highlight of highlightList) {
          // ????????? ??? ????????? ?????????????????? ?????????
          if (highlight.className === nodeId) {
            highlight.removeAttribute("style");
            const deletedTextNode = highlight.cloneNode(true);
            highlight.parentNode.replaceChild(deletedTextNode, highlight);
          }
        }
      } else if (curNodeType === 2) {
        // ????????? ??? ????????? ?????????????????? ?????????
        node.removeAttribute("style");
        const deletedImage = node.cloneNode(true);
        node.parentNode.replaceChild(deletedImage, node);

        // ????????? ??????????????? ?????? ????????????
        setEventOnImage(deletedImage);
      }
    }
  );

  hideToolBar();
}

function showToolBar(event, node, user, nodetype) {
  const html = document.querySelector("html");
  const userImageButton = document.getElementById("btn_userImage_highlighters");
  const toolBar = document.getElementById("toolBar-highlighters");

  curNode = node; // ?????? ????????? ??????????????? ????????????
  curNodeType = nodetype; // ?????? ????????? ??????????????? ?????? ?????? ????????????
  userImageButton.setAttribute("src", user); // ?????? ????????? ?????????????????? ?????? ???????????? ??????

  // ?????? ?????? : ?????? ?????? ????????? ??? ????????? ???????????? ????????? ????????? ??????
  const background = document.createElement("div");
  background.setAttribute("id", "background-highlighters");
  background.style.cssText = backgroundCSS;
  background.addEventListener("click", hideToolBar);
  html.appendChild(background);

  // ????????? ????????? ????????? ???????????? ????????? ????????? ??????
  const divTop = event.pageY - 50;
  const divLeft = event.pageX - 40;

  // ?????? ????????? ??????
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

function setEventOnImage(image) {
  const button = document.getElementById("btn_image_highlighters");
  const pos = image.getBoundingClientRect();

  // ?????? ?????? ????????? ???????????? ??????????????? ??????
  if (pos.height > 150 || pos.width > 150) {
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // ???????????? MouseOver?????? ??? ?????? ?????????
    image.addEventListener("mouseover", () => {
      button.style.top = pos.top + scrollY + 10 + "px";
      button.style.left = pos.left + scrollX + 10 + "px";
      button.style.transform = "rotate(270deg)";
      button.style.zIndex = "2147483647";
      button.style.display = "block";
      button.style.position = "absolute";

      selectedImage = image;
    });

    // ??????????????? MouseOut?????? ??? ?????? ????????????
    image.addEventListener("mouseout", () => (button.style.display = "none"));
  }
}

function checkImages() {
  const images = document.querySelectorAll("img");

  for (const image of images) {
    // ?????????????????? ???????????? ??????
    if (image.classList.contains("highlighted")) continue;

    // ??????????????? ?????? ????????? ??????
    setEventOnImage(image);
  }
}

function makeButton(name, image, height, width, top, left) {
  const button = document.createElement("input");
  button.setAttribute("id", `btn_${name}_highlighters`);
  button.setAttribute("type", "image");

  button.src = image;
  button.style.height = `${height}px`;
  button.style.width = `${width}px`;

  button.style.top = top ? `${top}px` : null;
  button.style.left = left ? `${left}px` : null;

  return button;
}

function makeToolBar() {
  const rootDiv = document.createElement("div");
  rootDiv.setAttribute("id", "toolBar-highlighters");
  rootDiv.style.cssText = toolBarCSS;

  // ?????? ????????? ??????
  const userImageButton = makeButton("userImage", userImage, 22, 22, 9, 10);
  userImageButton.style.position = "relative";
  userImageButton.style.borderRadius = "15px";

  // ???????????? ??????
  const deleteImage = "https://cdn-icons-png.flaticon.com/512/484/484662.png";
  const deleteButton = makeButton("delete", deleteImage, 20, 20, 8, 22);
  deleteButton.style.position = "relative";
  deleteButton.addEventListener("click", () => deleteHighlight(curNode));

  // ????????? ??????
  const homeImage = "https://cdn-icons-png.flaticon.com/512/1946/1946488.png";
  const homeButton = makeButton("home", homeImage, 20, 20, 8, 35);
  homeButton.style.position = "relative";
  homeButton.addEventListener("click", () =>
    window.open("https://highlighters.site/")
  );

  rootDiv.appendChild(userImageButton);
  rootDiv.appendChild(deleteButton);
  rootDiv.appendChild(homeButton);

  return rootDiv;
}

function setPenColor(penColor) {
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

  let pen_src;
  switch (penColor) {
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

  return pen_src;
}

async function initHighlighters() {
  const html = document.querySelector("html");
  const highlightColorInSync = await chrome.storage.sync.get("highlightColor");
  highlightColor = highlightColorInSync.highlightColor;
  const pen_src = setPenColor(highlightColor);

  const textPenButton = makeButton("text", pen_src, 35, 35);
  textPenButton.style.display = "none";
  textPenButton.addEventListener("click", postHighlight);

  const imagePenButton = makeButton("image", pen_src, 35, 35);
  imagePenButton.style.display = "none";
  imagePenButton.addEventListener("click", highlightImage);
  imagePenButton.addEventListener("mouseover", () => {
    imagePenButton.style.display = "block";
  });

  const toolBar = makeToolBar();

  html.appendChild(textPenButton);
  html.appendChild(imagePenButton);
  html.appendChild(toolBar);

  getUserImage();
}

/* contentscript ?????? */
initHighlighters();

// ??????????????? ???????????? ?????? selection ?????? ??????
document.onmouseup = function (e) {
  // Highlighters??? ?????? ??????????????? ??? ?????????(blackList) ??????
  const currentURL = window.location.href;
  for (const url of blackList) if (currentURL === url) return;

  const button = document.getElementById("btn_text_highlighters");
  const sel = document.getSelection();

  // ????????? ??????????????? ?????? mouseup ????????? ?????? ?????? ??? == ?????? ?????? ???
  if (sel.isCollapsed || sel.toString() === highlightStr) {
    button.style.display = "none";
    return;
  } //
  else {
    selectionText = sel;
    highlightStr = sel.toString();

    // ???????????? ????????? ????????? ????????????.
    const direction = sel.anchorOffset - sel.focusOffset < 0;
    const divTop = direction ? e.pageY + 10 : e.pageY - 40;
    const divLeft = direction ? e.pageX + 10 : e.pageX - 40;
    button.style.transform = direction ? "rotate(0deg)" : "rotate(180deg)";

    // Highlight ?????? ????????? ????????????.
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
      const highlightList = request.data ? request.data : [];
      // [????????????] console.log("[cs] getHighlight", highlightList);

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

      for (const highlight of highlightList) {
        try {
          if (highlight.type === 1) rehighlightText(highlight);
          else if (highlight.type === 2) rehighlightImage(highlight);
          else if (highlight.type === 3) rehighlightVideo(highlight);
        } catch (e) {
          console.log("??????????????? ?????? ??????", e);
        }
      }

      checkImages();
      sendResponse({ farewell: "good" });
      break;

    case "newVideo":
      currentVideo = request.videoID;
      newVideoLoaded();
      break;

    // ??????????????? ?????????????????? ????????? ??????
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

      sendResponse({
        title,
        image,
        description,
      });
      break;

    case "realtimehighlight": // ??????????????? ???????????? ???????????? ??????????????? ?????? (db??? ??????????????? ??????)
      console.log("[contentscript]: realtimehighlight: ", request);
      try {
        if (request.data.type === 1) rehighlightText(request.data);
        else if (request.data.type === 2) rehighlightImage(request.data);
      } catch (e) {
        console.log("??????????????? ?????? ??????", e);
      }
      break;

    case "changeCurrentColor":
      console.log("[contentscript]: changeCurrentColor: ", request.data);
      const textPenButton = document.getElementById("btn_text_highlighters");
      const imagePenButton = document.getElementById("btn_image_highlighters");
      const pen_src = setPenColor(request.data);

      textPenButton.src = pen_src;
      imagePenButton.src = pen_src;
      sendResponse({ response: "ok" });
      break;

    default:
      console.log(request, sender);
      break;
  }
  return true;
});
