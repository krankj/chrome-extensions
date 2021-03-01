chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: "chrome://newtab" });
});
// Read it using the storage API
