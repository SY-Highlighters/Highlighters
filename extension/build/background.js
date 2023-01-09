const is_production = true;

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
  console.log("[background.js] postHighlight", token, request);

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
  return data;
}

/* 코드 시작 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  getCookieToken().then((cookie) => {
    const token = cookie?.value;

    switch (request.greeting) {
      case "postHighlight": // 웹페이지의 하이라이팅을 디비로 전송
        postHighlight(token, request.data)
          .then((data) => sendResponse({ data }))
          .catch((error) => console.log(`fetch 실패: ${error}`));
        break;

      case "getHighlight": // 웹페이지의 모든 하이라이트를 가져옴
        getHighlight(token, request.data)
          .then((data) => sendResponse({ data }))
          .catch((error) => console.log(`fetch 실패: ${error}`));
        break;

      case "postNoti": // 노티 생성
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

    // 웹페이지의 하이라이팅을 디비로 전송
    // if (request.greeting === "posthighlight") {
    //   postHighlight(token, request.data)
    //     .then((data) => sendResponse({ data }))
    //     .catch((error) => console.log(`fetch 실패: ${error}`));
    // }

    // // 웹페이지의 모든 하이라이트를 가져옴
    // else if (request.greeting === "gethighlight") {
    //   getHighlight(token, request.data)
    //     .then((data) => sendResponse({ data }))
    //     .catch((error) => console.log(`fetch 실패: ${error}`));
    // }
  });

  return true;
});
