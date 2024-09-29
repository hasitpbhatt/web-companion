// background.js

// Example: Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getContent") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            sendResponse({ content: activeTab });
        });
        return false; // Indicates you want to send a response asynchronously
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "storeData") {
      chrome.storage.sync.set({ data: message.data }, () => {
        console.log('Data stored in background storage');
      });
    }
  });
