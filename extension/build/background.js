const is_production = false;

const cookie_url = is_production
  ? "https://highlighters.site"
  : "http://localhost:3000";

const host_url = is_production
  ? "https://highlighters.site"
  : "http://localhost:3001";

let feedExist;
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
  const response = await fetch(`${host_url}/api/highlight/feed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  const data = await response.json();

  // if (data.success === false) {
  //   feedExist = false;
  // } else feedExist = true;
  // console.log("[getHighlight] feedExist set:", feedExist);

  return data;
}

async function postNoti(token, request) {
  chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.query({ active: true, currentWindow: true }, (pages) => {
    chrome.tabs.sendMessage(pages[0].id, { greeting: "getCurUrl" }, (r) => {
      const currentUrl = r;
      const noti = {
        url: currentUrl,
        contents: request,
      };
      console.log(noti);

      const response = fetch(`${host_url}/api/noti/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noti),
      });
      const data = response.json();
      return data;
    });
  });
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

async function getFeed(token, url) {
  const response = await fetch(`${host_url}/api/feed/url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(url),
  });
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

async function checkNewNoti(token) {
  const response = await fetch(`${host_url}/api/noti/check`, {
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
const jwt_token = getCookieToken().then((cookie) => cookie?.value);

chrome.alarms.create("checkNoti", {
  periodInMinutes: 1 / 6,
  when: Date.now(),
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkNoti") {
    jwt_token.then((token) => {
      checkNewNoti(token).then((is_changed) => {
        if (is_changed) {
          console.log("새로운 알림이 있습니다");
        }
      });
    });
  }
});

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

      case "getFeed":
        chrome.windows.getCurrent(function (win) {
          chrome.tabs.query(
            { windowId: win.id, active: true },
            function (tabs) {
              if (tabs.length !== "undefined" && tabs.length === 1)
                var currentURL = tabs[0].url;
              console.log(currentURL);
              getFeed(token, currentURL)
                .then((data) => sendResponse({ data }))
                .catch((error) => console.log(`fetch 실패: ${error}`));
            }
          );
        });
        break;

      default:
        console.log(request, sender);
        break;
    }
  });
  return true;
});

// // when a chrome tab is changed, set currentUrl to the changed tab's url and if a changed tab has feed, make feedExist true, if a changed tab doesn't have feed, make feedExist false
// chrome.tabs.onActivated.addListener(function (activeInfo) {
//   // 탭이 변경되면
//   chrome.tabs.get(activeInfo.tabId, function (tab) {
//     currentUrl = tab.url; // currentUrl 업데이트
//     console.log("[onActivated] currentUrl:", currentUrl);
//     // getHighlight를 통해 feed가 있는지 확인
//     jwt_token.then((token) => {
//       getHighlight(token, { url: currentUrl })
//         .then((data) => {
//           if (data.success === false) {
//             feedExist = false;
//           } else feedExist = true;
//           console.log("[onActivated] feedExist set:", feedExist);
//         })
//         .catch((error) => console.log(`fetch 실패: ${error}`));
//     });
//   });
// });
