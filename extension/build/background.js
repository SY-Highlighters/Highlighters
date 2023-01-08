const is_production = false;

const cookie_url = is_production
  ? "https://highlighters.site"
  : "http://localhost:3000";

const host_url = is_production
  ? "https://highlighters.site"
  : "http://localhost:3001";

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

// 코드 시작
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  getCookieToken().then((cookie) => {
    const token = cookie?.value;

    // 웹페이지의 하이라이팅을 디비로 전송
    if (request.greeting === "posthighlight") {
      postHighlight(token, request.data)
        .then((data) => sendResponse({ data }))
        .catch((error) => console.log(`fetch 실패: ${error}`));
    }

    // 웹페이지의 모든 하이라이트를 가져옴
    else if (request.greeting === "gethighlight") {
      getHighlight(token, request.data)
        .then((data) => sendResponse({ data }))
        .catch((error) => console.log(`fetch 실패: ${error}`));
    }
  });

  return true;
});
