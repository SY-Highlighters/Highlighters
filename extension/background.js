chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 웹페이지의 하이라이팅을 디비로 전송
  if (request.greeting === "posthighlight") {
    fetch("http://localhost:3001/api/highlight/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.data),
    }).then((response) => {
      console.log
      sendResponse({ farewell: response });
    });
    return true;
  }
  // 웹페이지의 모든 하이라이트를 불러옴
  else if (request.greeting === "gethighlight") {
    console.log(request.data);
    fetch("http://localhost:3001/api/highlight/feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.data),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("gethighlight in bg", data);
        sendResponse({ data: data });
      })
      .catch((error) => console.log("gethighlight in bg : none"));
    return true;
  }
});
