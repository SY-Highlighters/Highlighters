// 서버로부터 현재 페이지 정보 받아오기
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  data = { url: `${tab.url}` };
  fetch("http://localhost:3001/api/highlight/feed", {
    method: "Post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      chrome.tabs.sendMessage(tabId, { data: data });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

chrome.runtime.onMessage.addListener((obj, sender, response) => {
  const { type, data } = obj;
  if (type === "highlight") {
    fetch("http://localhost:3001/api/highlight", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        chrome.tabs.sendMessage(tabId, { data: data });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
