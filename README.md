LinkedIn Email Extractor

LinkedIn Email Extractor is a Chrome extension that extracts email addresses from LinkedIn profiles and sends the extracted email to a backend API for processing. This extension is designed for simplicity and ease of use, leveraging Chrome Extension APIs to interact with LinkedIn pages.

Features

Extract Emails: The extension scans the visible text of LinkedIn profiles to extract email addresses.

Send to Backend: Sends the extracted email to a backend API for further processing.
User Interface: Displays the extracted email and any response messages from the backend directly in the extension popup.

Files Overview
1. Manifest File (manifest.json)
Defines the extension's metadata and permissions.

manifest_version: Version 3 for modern Chrome extensions.
permissions: Grants access to scripting, active tabs, and tab details.
host_permissions: Allows the extension to work on LinkedIn URLs.
Configures background scripts, content scripts, and the popup interface.
2. Background Script (background.js)
Handles the extension's installation event and initializes the service worker.

javascript
Copy code
chrome.runtime.onInstalled.addListener(() => {
    console.log("LinkedIn Email Extractor installed.");
});
3. Content Script (content.js)
Executes within the context of LinkedIn pages to scan and extract email addresses.

javascript
Copy code
(() => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const profileText = document.body.innerText;
    const foundEmail = profileText.match(emailRegex);
    return foundEmail ? foundEmail[0] : null;
})();
4. Popup File (popup.html)
Defines the user interface for the extension, including a button to extract emails and a display area for results.

html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Extractor</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Email Extractor</h1>
        <button id="extract-email">Extract Email</button>
        <p id="email-display">No email found.</p>
    </div>
    <script src="popup.js"></script>
</body>
</html>
5. Popup Script (popup.js)
Handles user interactions and coordinates between the extension's content scripts and backend API.

javascript
Copy code
document.getElementById("extract-email").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                files: ["content.js"],
            },
            (results) => {
                const extractedEmail = results[0]?.result;

                const displayElement = document.getElementById("email-display");
                if (extractedEmail) {
                    displayElement.textContent = `Extracted Email: ${extractedEmail}`;

                    // Send the email to the backend
                    fetch("http://localhost:3000/api/email", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email: extractedEmail }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                displayElement.textContent = `Generated Message: ${data.email}`;
                            } else {
                                displayElement.textContent = `Backend Error: ${data.email}`;
                            }
                        })
                        .catch((error) => {
                            console.error("Error sending email to backend:", error);
                            displayElement.textContent = "Error: Unable to connect to the backend.";
                        });
                } else {
                    displayElement.textContent = "No email found.";
                }
            }
        );
    });
});
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/linkedin-email-extractor.git
cd linkedin-email-extractor
Open Chrome and navigate to chrome://extensions.

Enable Developer Mode.

Click Load Unpacked and select the cloned repository folder.

Usage
Open a LinkedIn profile in your browser.
Click on the extension icon in the toolbar.
Press the Extract Email button in the popup interface.
View the extracted email and backend response.
Backend API
The extension sends a POST request to the backend at http://localhost:3000/api/email. The API should accept a JSON payload in the following format:

json
Copy code
{
    "email": "extracted_email@example.com"
}
The API response should include a success field to indicate the status and optionally an email field with additional information.

License
This project is open-source and available under the MIT License.

Contributions
Contributions, bug reports, and feature requests are welcome! Feel free to fork the repository and submit a pull request.