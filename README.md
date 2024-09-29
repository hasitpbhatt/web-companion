# Web Companion Browser Extension

A browser extension that allows users to chat with webpage content through an interactive assistant, leveraging the Groq API to provide relevant responses based on the current page context.

## Features

- **Chat Interface**: A simple and user-friendly chat interface to interact with the assistant.
- **API Key Management**: Users can enter and save their API key securely to access the Groq API.
- **Contextual Assistance**: The assistant uses the current page content to provide relevant and contextual responses.
- **Dynamic Interaction**: Users can send messages and receive responses in real-time.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hasitpbhatt/web-companion.git
   cd web-companion
   ```

2. **Load the extension in your browser**:
   - For Chrome:
     1. Open Chrome and go to `chrome://extensions/`.
     2. Enable "Developer mode" at the top right.
     3. Click on "Load unpacked" and select the directory containing the extension files.

3. **Set up your API Key**:
   - Click on the extension icon to open the chat interface.
   - Click on "Update API Key" and enter your Groq API key, then save it.

## Usage

1. **Interact with the Assistant**:
   - Type your message in the input box and hit **Enter** or click the **Send** button.
   - The assistant will respond based on the content of the current page and your query.

2. **Toggle API Key Input**:
   - Click the "Update API Key" button to reveal the API key input fields. Enter your API key and model, then save.

## File Structure

- **popup.html**: The HTML structure for the popup interface.
- **popup.js**: JavaScript for managing chat interactions, API requests, and local storage.
- **background.js**: Background script to handle messaging and data storage.

## Technologies Used

- JavaScript
- HTML
- CSS
- Chrome Extensions API
- Groq API

## Contribution

Feel free to submit issues or pull requests if you have suggestions for improvements or new features!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
