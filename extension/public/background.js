const is_production = false;

const cookie_url = is_production
  ? "https://highlighters.site"
  : "http://localhost:3000";

const host_url = is_production
  ? "https://highlighters.site"
  : "http://localhost:3001";

let currentUrl;

async function getCookieToken() {
  const cookie = await new Promise((resolve) => {
    chrome.cookies.get({ name: "logCookie", url: cookie_url }, (cookie) =>
      resolve(cookie)
    );
  });

  return cookie;
}

async function postHighlight(token, request) {
  const response = await fetch(`${host_url}/api/highlight`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  const data = await response.json();
  return data;
}

async function getHighlight(token, request) {
  currentUrl = request.url;
  const response = await fetch(`${host_url}/api/highlight/feed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  const data = await response.json();
  return data;
}

async function postNoti(token, request) {
  const noti = {
    url: currentUrl,
    contents: request,
  };
  console.log(noti);

  const response = await fetch(`${host_url}/api/noti/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noti),
  });
  const data = await response.json();
  return data;
}

async function getNoti(token) {
  const response = await fetch(`${host_url}/api/noti/extension`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log(data);
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

/* 코드 시작 */
const jwt_token = getCookieToken().then((cookie) => cookie?.value);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  jwt_token.then((token) => {
    switch (request.greeting) {
      // 웹페이지의 하이라이팅을 디비로 전송
      case "postHighlight":
        postHighlight(token, request.data)
          .then((data) => {
            sendResponse({ data });
            console.log(data);
            createPush(
              `${request.greeting}: ${data.id}`,
              `${String(data.contents).substring(0, 30)}...`,
              "하이라이트가 저장되었습니다"
            );
          })
          .catch((error) => console.log(`fetch 실패: ${error}`));
        break;

      // 웹페이지의 모든 하이라이트를 가져옴
      case "getHighlight":
        getHighlight(token, request.data)
          .then((data) => sendResponse({ data }))
          .catch((error) => console.log(`fetch 실패: ${error}`));
        break;

      // 노티 생성
      case "postNoti":
        postNoti(token, request.data)
          .then((data) => sendResponse({ data }))
          .catch((error) => console.log(`fetch 실패: ${error}`));
        break;

      case "getNoti":
        getNoti(token)
          .then((data) => sendResponse({ data }))
          .catch((error) => console.log(`fetch 실패: ${error}`));
        break;

      default:
        console.log(request, sender);
        break;
    }
  });

  return true;
});
