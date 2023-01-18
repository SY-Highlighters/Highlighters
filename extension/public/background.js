const is_production = true; // true: 배포용, false: 로컬용

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

/********************************************** 코드 시작 *********************************************************/
// let push_id = 1;
let userInfo;

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

    socket.send(
      JSON.stringify({
        event: "userinfo",
        userInfo,
      })
    );
  });

  socket.addEventListener("message", (message) => {
    const msg = JSON.parse(message.data);

    if (msg.event === "push") {
      chrome.action.setBadgeText({ text: "new" });
      chrome.action.setBadgeBackgroundColor({ color: "#0000FF" });
    }
  });
};

async function BackgroundStart() {
  await initHighlightColor();

  // chrome.alarms.create("checkNoti", {
  //   periodInMinutes: 1 / 6,
  //   when: Date.now(),
  // });

  // chrome.alarms.onAlarm.addListener(async (alarm) => {
  //   if (alarm.name === "checkNoti") {
  //     const cookie = await getCookieToken();
  //     const token = cookie?.value;

  //     const isNewNotiCreateURL = `${host_url}/api/noti/push`;
  //     const changeNewNotiInUserURL = `${host_url}/api/noti/check`;

  //     const check = await sendHTTPRequest("GET", isNewNotiCreateURL, token);

  //     if (check.data) {
  //       chrome.action.setBadgeText({ text: "new" });
  //       chrome.action.setBadgeBackgroundColor({ color: "#0000FF" });
  //       createPush(
  //         `push_${push_id}`,
  //         "새로운 알림이 있습니다.",
  //         "알림을 확인해주세요"
  //       );
  //       push_id++;
  //       sendHTTPRequest("GET", changeNewNotiInUserURL, token);
  //     }
  //   }
  // });

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
          const getHighlightURL = `${host_url}/api/highlight/feed/endpoint?url=${request.data.url}`;
          sendHTTPRequest("GET", getHighlightURL, token)
            .then((data) => sendResponse({ data }))
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;

        // 텍스트 하이라이트 포스트 요청
        case "postHighlight":
          console.log("[background] postHighlight");
          const postHighlightURL = `${host_url}/api/highlight/create`;
          sendHTTPRequest("POST", postHighlightURL, token, request.data) //
            .then((data) => {
              sendResponse({ data });
              createPush(
                `${request.greeting}: ${data.id}`,
                `${String(data.contents).substring(0, 30)}...`,
                "하이라이트가 저장되었습니다"
              );
            })
            .catch((error) => console.log(`fetch 실패: ${error}`));
          break;

        // 이미지 하이라이트 포스트 요청
        case "postHighlightImage":
          console.log("[background] postHighlightImage");
          const postHighlightImageURL = `${host_url}/api/highlight/create`;
          sendHTTPRequest("POST", postHighlightImageURL, token, request.data)
            .then((data) => {
              sendResponse({ data });
              createPush(
                `${request.greeting}: ${data.id}`,
                `${String(data.contents).substring(0, 30)}...`,
                "하이라이트가 저장되었습니다"
              );
            })
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
