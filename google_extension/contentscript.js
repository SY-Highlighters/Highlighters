let selectionText;
let highlightStr = "null";
let src = chrome.runtime.getURL("images/pen.png");
// 토큰이 없으면 한번만 리다이렉트
// if (localStorage.getItem("token") == null) {
//   if (window.location.href != "https://www.naver.com/") {
//     window.location.href = "https://www.naver.com/";
//   }
// }

let penButton = `<input id="btn" type="image" src=${src}
      height = "50" width="50">`;

let body = document.querySelector("html");
body.innerHTML += penButton;
let text = document.getElementById("btn");
text.style.display = "none";
console.log("body");

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

    // 레이어 위치를 변경한다.
    let text = document.getElementById("btn");
    text.style.top = divTop + "px";
    text.style.left = divLeft + "px";
    text.style.position = "absolute";
    text.style.display = "block";
  } else {
    let text = document.getElementById("btn");
    text.style.display = "none";
  }
  console.log("mouse up");
});
