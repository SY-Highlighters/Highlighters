const is_production = false; // true: 배포용, false: 로컬용

const cookie_url = is_production
  ? "https://highlighters.site"
  : "http://localhost:3000";
const host_url = is_production
  ? "https://highlighters.site"
  : "http://localhost:3001";
const websocket_url = is_production
  ? "wss://highlighters.site"
  : "ws://localhost:3001";

function getCookieToken() {
  return chrome.cookies.get({ name: "logCookie", url: cookie_url });
}

async function sendHTTPRequest(method, url, token, body) {
  let response = null;

  if (body) {
    // POST fetch
    response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  } else {
    // GET fetch
    response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  const data = await response.json();
  return data;
}

function createPush(id, title, msg) {
  chrome.notifications.create(
    id,
    {
      type: "basic",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/3237/3237124.png",
      title: title,
      message: msg,
    },
    (notificationId) => {
      console.log(notificationId);
    }
  );
}

async function initHighlightColor() {
  const data = await chrome.storage.sync.get("highlightColor");
  if (data.highlightColor === undefined) {
    chrome.storage.sync.set({ highlightColor: "#E9D5FF" });
  }

  console.log("Init Highlight Complete");
}

function connectWebsocket() {
  const socket = new WebSocket(`${websocket_url}/api/ws`);
  socket.onopen = async () => {
    console.log("소켓 연결 성공");

    await getCookieToken().then(async (cookie) => {
      const token = cookie?.value;
      userInfo = await sendHTTPRequest(
        "GET",
        `${host_url}/api/user/signin`,
        token
      );

      // push 보내기
      socket.send(
        JSON.stringify({
          event: "userinfo",
          userInfo,
        })
      );
    });

    // push 받기
    socket.addEventListener("message", (message) => {
      const msg = JSON.parse(message.data);
      const data = msg.data;

      if (data.email === userInfo.email) return;

      if (msg.event === "push") {
        console.log("push", msg.data);
        chrome.action.setBadgeText({ text: "new" });
        chrome.action.setBadgeBackgroundColor({ color: "#0000FF" });
        createPush(
          `push_${push_id}`,
          `${data.nickname}으로부터 알림이 왔습니다.`,
          data.contents
        );
        push_id++;
      }

      if (msg.event === "highlight") {
        console.log("[bakcground]: realtime highlight message 받음");
        // websocket으로 넘겨받은 highlight한 url이 현재 나의 url과 같다면 highlight를 치기.
        const feed_url = data.feed_url;
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            if (tabs.length !== "undefined" && tabs.length === 1) {
              const currentURL = decodeURI(tabs[0].url);
              console.log("[background]: realtime highlight 현재탭 확인");
              if (currentURL === feed_url) {
                // 넘겨받은 url과 현재 url이 같다면 contentscript에서 highlight 치기
                console.log("[background]: realtime highlight 실행");
                chrome.tabs.sendMessage(tabs[0].id, {
                  greeting: "realtimehighlight",
                  data,
                });
              }
            }
          }
        );
      }
    });

    socket.onclose = () => {
      console.log("소켓 연결 종료");
      connectWebsocket();
    };
  };
}

/********************************************** 코드 시작 *********************************************************/
let push_id = 1;
let userInfo;

async function BackgroundStart() {
  connectWebsocket();

  await initHighlightColor();

  const cookie = await getCookieToken();
  const token = cookie ? cookie.value : null;

  chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    let url = decodeURI(tab.url);
    if (changeInfo.status === "complete") {
      if (url && url.includes("youtube.com/watch")) {
        const queryParameters = url.split("?")[1];
        const urlParameters = new URLSearchParams(queryParameters);

        console.log("[bg]Youtube Param", urlParameters.get("v"));

        chrome.tabs.sendMessage(tabId, {
          greeting: "newVideo",
          videoID: urlParameters.get("v"),
        });

        url = `https://www.youtube.com/watch?v=${urlParameters.get("v")}`;
      }

      const getHighlightURL = `${host_url}/api/highlight/feed`;
      setTimeout(async () => {
        const data = await sendHTTPRequest("POST", getHighlightURL, token, {
          url,
        });
        chrome.tabs.sendMessage(tabId, {
          greeting: "getHighlight",
          data: data.data,
        });
      }, 500);
    }
  });

  // 새로운 url이 열리고 모든 DOM이 완성된 후에 현재 url에 대한 모든 하이라이트 정보 요청
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    getCookieToken().then((cookie) => {
      const token = cookie?.value;

      switch (request.greeting) {
        // 유저 정보 불러오기
        case "getUserInfo":
          console.log("[background] getUserInfo");
          const getUserInfoURL = `${host_url}/api/user/signin`;
          sendHTTPRequest("GET", getUserInfoURL, token, request.data)
            .then((data) => sendResponse({ data }))
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;

        // 현재 탭의 url에 대한 피드 정보 요청
        case "getFeed":
          console.log("[background] getFeed");
          const getFeedURL = `${host_url}/api/feed/feed_url`;
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              if (tabs.length !== "undefined" && tabs.length === 1) {
                const currentURL = decodeURI(tabs[0].url);
                sendHTTPRequest("POST", getFeedURL, token, { url: currentURL })
                  .then((data) => sendResponse({ data }))
                  .catch((error) => console.log(`fetch 실패: ${error}`));
              }
            }
          );
          break;

        // 피드 생성 요청
        case "postFeed":
          console.log("[background] postFeed");
          const postFeedURL = `${host_url}/api/feed/create`;
          sendHTTPRequest("POST", postFeedURL, token, request.data)
            .then((data) => sendResponse({ data }))
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;

        // 웹페이지의 모든 하이라이트를 가져옴
        case "getHighlight":
          console.log("[background] getHighlight");
          const url = request.data.url;
          const getHighlightURL = `${host_url}/api/highlight/feed`;
          sendHTTPRequest("POST", getHighlightURL, token, { url })
            .then((data) => sendResponse({ data }))
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;

        // 텍스트 하이라이트 포스트 요청
        case "postHighlight":
          console.log("[background] postHighlight");
          console.log(request.data);
          const postHighlightURL = `${host_url}/api/highlight/create`;
          sendHTTPRequest("POST", postHighlightURL, token, request.data) //
            .then((data) => sendResponse({ data }))
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;

        // 이미지 하이라이트 포스트 요청
        case "postHighlightImage":
          console.log("[background] postHighlightImage");
          const postHighlightImageURL = `${host_url}/api/highlight/create`;
          sendHTTPRequest("POST", postHighlightImageURL, token, request.data)
            .then((data) => sendResponse({ data }))
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;

        // 하이라이트 삭제 요청
        case "deleteHighlight":
          console.log("[background] deleteHighlight");
          const deleteHighlightURL = `${host_url}/api/highlight/delete`;
          sendHTTPRequest("DELETE", deleteHighlightURL, token, request.data)
            .then((data) => sendResponse({ data }))
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;

        // 유저가 받은 노티 리스트 요청
        case "getNoti":
          console.log("[background] getNoti");
          chrome.action.setBadgeText({ text: "" });
          const getNotiURL = `${host_url}/api/noti/extension`;
          sendHTTPRequest("GET", getNotiURL, token, request.data)
            .then((data) => sendResponse({ data }))
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;

        // 현재 탭의 url에 대한 노티 생성
        case "postNoti":
          console.log("[background] postNoti");
          const postNotiURL = `${host_url}/api/noti/create`;
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              if (tabs.length !== "undefined" && tabs.length === 1) {
                const currentURL = decodeURI(tabs[0].url);
                const body = { url: currentURL, contents: request.data };
                sendHTTPRequest("POST", postNotiURL, token, body)
                  .then((data) => sendResponse({ data }))
                  .catch((error) => console.log(`fetch 실패: ${error}`));
              }
            }
          );
          break;

        // 그룹의 태그 리스트 요청
        case "getGroupTags":
          console.log("[background] getGroupTags");
          const getGroupTagsURL = `${host_url}/api/tag/web`;
          sendHTTPRequest("GET", getGroupTagsURL, token)
            .then((data) => sendResponse({ data }))
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;
        

        default:
          console.log("[background] Bad Request");
          break;
      }
    });
    return true;
  });
}

BackgroundStart();
