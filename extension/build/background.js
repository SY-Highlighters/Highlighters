chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 쿠키에서 토큰 가져와서 request header에 넣기
  let token = "none";
  chrome.cookies.get(
    { name: "logCookie", url: "https://highlighters.site/" },
    (cookie) => {
      if (cookie) {
        console.log("[background.js] 브라우저에서 cookie 받아옴");
        token = cookie.value;

        // 웹페이지의 하이라이팅을 디비로 전송
        if (request.greeting === "posthighlight") {
          console.log(
            "[background.js] posthighlight request",
            token,
            request.data
          );
          fetch("https://highlighters.site/api/highlight/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request.data),
          }).then((response) => {
            sendResponse({ farewell: response });
          });
        }

        // 웹페이지의 모든 하이라이트를 가져옴
        else if (request.greeting === "gethighlight") {
          console.log(
            "[background.js] gethighlight request 하기 전",
            token,
            request.data
          );
          fetch("https://highlighters.site/api/highlight/feed", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(request.data),
          })
            .then((response) => {
              console.log("[background.js] gethighlight response", response);
              return response.json();
            })
            .then((data) => {
              console.log("[background.js] gethighlight response data", data);
              sendResponse({ data: data });
              // return true;
            })
            .catch((error) =>
              console.log(
                "<fetch error>: [background.js] gethighlight error: ",
                error
              )
            );
        }
      } else {
        console.log("cookie 없음");
      }
    }
  );
  return true;
});
