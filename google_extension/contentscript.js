let selectionText;
let highlightStr = "null";
let src = chrome.runtime.getURL("images/pen.png");
// 토큰이 없으면 한번만 리다이렉트
// if (localStorage.getItem("token") == null) {
//   if (window.location.href != "https://www.naver.com/") {
//     window.location.href = "https://www.naver.com/";
//   }
// }

chrome.runtime.onMessage.addListener(function (obj, sender, response) {
  const { data } = obj;
  console.log(data);
  if (data) {
    data.forEach((element) => {
      let range = document.createRange();
      // 시작 노드 복원
      let startNode = document.evaluate(
        element.selection.startXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      let startOff = Number(element.selection.startOffset);
      console.log(startNode);
      console.log(startOff);
      // 종료 노드 복원
      let endNode = document.evaluate(
        element.selection.endXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      let endOff = Number(element.selection.endOffset);

      // 복원한 시작노드, 종료 노드 기준으로 range 복원
      range.setStart(startNode, startOff);
      range.setEnd(endNode, endOff);

      let newNode = document.createElement("span");
      newNode.style.backgroundColor = "yellow";
      range.surroundContents(newNode);
    });
  }
});

let penButton = `<input id="btn" type="image" src=${src} height = "50" width="50">`;
let body = document.querySelector("body");
body.innerHTML += penButton;
let text = document.getElementById("btn");
text.addEventListener("click", highlight);
text.style.display = "none";

function highlight() {
  let range = selectionText.getRangeAt(0);
  postHighlight(range, highlightStr); // highlight post 요청
  let newNode = document.createElement("span");
  newNode.style.backgroundColor = "yellow";
  range.surroundContents(newNode);
  text.style.display = "none";
}

function postHighlight(range, highlightStr) {
  const rangeobj = {
    startXPath: makeXPath(range.startContainer),
    startOffset: range.startOffset,
    endXPath: makeXPath(range.endContainer),
    endOffset: range.endOffset,
  };
  chrome.runtime.sendMessage(
    {
      type: "highlight",
      data: {
        url: window.location.href,
        contents: highlightStr,
        selection: rangeobj,
        // Authorization: `Bearer ${document.cookie}`,
      },
    },
    function (response) {
      console.log(response);
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

function getSelect() {
  let sel = "";
  if (document.getSelection) {
    sel = document.getSelection();
  } else if (document.selection) {
    sel = document.selection.createRange().text;
  }
  return sel;
}

addEventListener("mouseup", function (e) {
  let sel = getSelect();
  if (sel.toString().length > 0 && sel.toString() != highlightStr) {
    selectionText = sel;
    highlightStr = sel.toString();

    let divTop = e.pageY + 10;
    let divLeft = e.pageX + 10;
    console.log(e.pageY);

    // 레이어 위치를 변경한다.
    text.style.position = "absolute";
    text.style.display = "block";
    text.style.zIndex = "9999";
    text.style.top = divTop + "px";
    text.style.left = divLeft + "px";
  } else {
    text.style.display = "none";
  }
  console.log("mouse up");
});
