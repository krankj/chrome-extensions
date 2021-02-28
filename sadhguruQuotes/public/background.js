chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({ url: "chrome://newtab" });
});

chrome.storage.sync.set({ foo: "hello", bar: "hi" }, function () {
  console.log("Settings saved");
});

// Read it using the storage API
