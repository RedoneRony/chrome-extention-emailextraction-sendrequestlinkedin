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
                                displayElement.textContent = `Response Message: ${data.message}`;
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
