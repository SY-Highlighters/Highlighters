/* 코드시작 */
let selectionText;
let highlightStr = "null";

function onWindowReady() {

  function highlight() {
    let range = selectionText.getRangeAt(0);
    postHighlight(range, highlightStr); // highlight post 요청
    let newNode = document.createElement("span");
    newNode.style.backgroundColor = "#fef08a";
    range.surroundContents(newNode);
    let botton = document.getElementById("btn");
    botton.style.display = "none";
  }

  let penButton = `<input id="btn" type="image" src="https://images.vexels.com/media/users/3/206292/isolated/preview/0a3fddb8fdf07b7c1f42a371d420c3f2-yellow-highlighter-flat.png"
  height = "50" width="50">`;

  let body = document.querySelector("html");
  body.innerHTML += penButton;

  let botton = document.getElementById("btn");
  botton.style.display = "none";

  botton.addEventListener("click", highlight); // 드래그하면 상단의 highlight 함수 실행

  getHighlight(window.location.href); // highlight 가져오기
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

/* 하이라이트 Post */
function postHighlight(range, highlightStr) {
  const rangeobj = {
    startXPath: makeXPath(range.startContainer),
    startOffset: range.startOffset,
    endXPath: makeXPath(range.endContainer),
    endOffset: range.endOffset,
  };

  chrome.runtime.sendMessage(
    {
      greeting: "posthighlight",
      data: {
        url: range.startContainer.baseURI,
        contents: highlightStr,
        selection: rangeobj,
      },
    },
    (response) => {
      console.log(response.farewell);
    }
  );
}

/* 하이라이트 Get */
function getHighlight(url) {
  chrome.runtime.sendMessage(
    {
      greeting: "gethighlight",
      data: { url: url },
    },
    (response) => {
      // console.log("gethighlight in cs", response);
      for (const highlight of response.data) {
        console.log(highlight);
        let selection = highlight.selection;
        let range = document.createRange();

        // 시작 노드 복원
        let startNode = document.evaluate(
          selection.startXPath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;

        let startOff = Number(selection.startOffset);

        // 종료 노드 복원
        let endNode = document.evaluate(
          selection.endXPath,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        ).singleNodeValue;
        let endOff = Number(selection.endOffset);

        // 복원한 시작노드, 종료 노드 기준으로 range 복원
        range.setStart(startNode, startOff);
        range.setEnd(endNode, endOff);

        let newNode = document.createElement("span");
        newNode.style.backgroundColor = "#fef08a";
        range.surroundContents(newNode);
      }
    }
  );
}

// select
function getSelect() {
  let sel = "";
  if (document.getSelection) {
    sel = document.getSelection();
  } else if (document.selection) {
    sel = document.selection.createRange().text;
  }
  return sel;
}

/* contentscript 시작 */

if (
  window.location.href !== `http://localhost:3000/` &&
  window.location.href !== "https://highlighters.site/" &&
  window.location.href !== "http://localhost:5555/"
) {
  window.onload = onWindowReady;

  // 드래그하고 마우스를 떼면 selection 객체 생성
  document.onmouseup = function (e) {
    let sel = getSelect();

    if (sel.toString() !== "" && sel.toString() !== highlightStr) {
      selectionText = sel;
      highlightStr = sel.toString();

      // 드래그한 영역의 위치를 가져온다.
      let divTop = e.pageY + 10;
      let divLeft = e.pageX + 10;

      // 드래그한 영역의 위치에 레이어를 띄운다.
      // 레이어의 위치를 변경하고 싶으면 위치값을 수정한다.
      // 레이어가 화면을 벗어나면 안되므로 위치값을 수정한다.

      let botton = document.getElementById("btn");

      // 레이어 위치를 변경한다.

      botton.style.top = divTop + "px";
      botton.style.left = divLeft + "px";
      botton.style.position = "absolute";
      botton.style.display = "block";
    }
  };
} else {
  let botton = document.getElementById("btn");
  botton.style.display = "none";
}
