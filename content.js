// Extract text from the body of the webpage
const pageContent = document.body.innerText;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in content script:", request); // Log received message
    if (request.action === "getPageContent") {
        const content = document.body.innerText;
        console.log("Sending back content:", content); // Log the content being sent
        sendResponse({ content });
    } 
    else {
        console.warn("Unknown action:", request.action);
        sendResponse({ content: "No content available." });
    }
});

// chrome.runtime.sendMessage({ action: "storeData", data: yourData });
