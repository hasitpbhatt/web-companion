const gptModel = "llama-3.2-11b-text-preview";
const gptAPIPath = "https://api.groq.com/openai/v1/chat/completions";

const BASE_SYSTEM_PROMPT = "You're an web browser extension, helping user with current page content, so try to use content provided as context. The response will be shown inside div block, so respond in html structure only.";

const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

const apiKeyInput = document.getElementById('api-key-input');
const modelInput = document.getElementById('model-input');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const toggleApiKeyBtn = document.getElementById('toggle-api-key-btn');
const apiKeyContainer = document.getElementById('api-key-container');


let chatHistory = [];

toggleApiKeyBtn.addEventListener('click', function () {
  apiKeyContainer.classList.toggle('hidden');
});

// Function to save the API key to local storage
function saveApiKey() {
  if (chrome.storage.sync) {
    chrome.storage.sync.set({ apiKey: apiKeyInput.value, model: modelInput.value }, () => {
      console.log('API key saved to sync storage');
    });
  } else {
    chrome.storage.local.set({ apiKey: apiKeyInput.value, model: modelInput.value }, () => {
      console.log('API key saved to local storage');
    });
  }
}

// Function to load the saved API key from local storage
function loadApiKey() {
  if (chrome.storage.sync) {
    chrome.storage.sync.get('apiKey', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error loading API key from sync storage:', chrome.runtime.lastError);
      } else {
        apiKeyInput.value = result.apiKey || '';
      }
    });
  } else {
    chrome.storage.local.get('apiKey', (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error loading API key from local storage:', chrome.runtime.lastError);
      } else {
        apiKeyInput.value = result.apiKey || '';
      }
    });
  }
}

// Function to get page content
function getPageContent() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getPageContent" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message:", JSON.stringify(chrome.runtime.lastError));
          resolve("No content available.");
        } else {
          console.log("Response received:", response); // Log the response
          if (response && response.content) {
            resolve(response.content);
          } else {
            console.warn("Response is empty or invalid:", response);
            resolve("No content available.");
          }
        }
      });
    });
  });
}


// Function to send a message to OpenAI API
async function sendMessage(message) {
  const response = await fetch(gptAPIPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + apiKeyInput.value
    },
    body: JSON.stringify({
      model: gptModel || modelInput.value,
      messages: [{
        "role": "system",
        "content": BASE_SYSTEM_PROMPT
      }, ...chatHistory, { "role": "user", "content": message }]
    })
  });

  if (!response.ok) {
    const errorData = await response.json(); // Get the error response
    throw new Error(`Error ${response.status}: ${errorData.message}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}


// Function to update the chat box
function updateChatBox(userMessage, assistantMessage) {
  if (userMessage) {
    chatBox.innerHTML += `<div><strong>You:</strong> ${userMessage}</div>`;
  } else {
    // chatBox.innerHTML = `<div>${assistantMessage}</div>`;
    chatBox.innerHTML += `<div><strong>Assistant:</strong> ${assistantMessage}</div>`;
  }
  chatBox.scrollTop = chatBox.scrollHeight;
}

apiKeyInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    saveApiKey();
  }
});

saveApiKeyBtn.addEventListener('click', () => {
  saveApiKey();
});

// Load the saved API key when the page loads
loadApiKey();


userInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent creating a new line
    sendBtn.click();        // Trigger the send button click
  }
});

// Event listener for the send button
sendBtn.addEventListener('click', async () => {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    const pageContent = await getPageContent(); // Get the page content
    const combinedMessage = `${userMessage}\n\nHere is the page content:\n${pageContent}`;
    chatHistory.push({ "role": "user", "content": userMessage });
    updateChatBox(userMessage, "Thinking...");
    userInput.value = '';

    try {
      const assistantMessage = await sendMessage(combinedMessage);
      chatHistory.push({ "role": "assistant", "content": assistantMessage });
      updateChatBox("", assistantMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      updateChatBox("", error);
      updateChatBox("", pageContent);
      updateChatBox("", "Error: Could not get a response.");
    }
  }
});

// Log to confirm script is running
console.log("Popup script loaded");
