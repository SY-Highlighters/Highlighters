// 텍스트를 받아온다
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request.text);
  // 텍스트를 번역한다
  translate(request.text);
});
