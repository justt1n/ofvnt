document.getElementById('downloadButton').addEventListener('click', () => {
    console.log("Download button clicked");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        console.error("No active tab found");
        return;
      }
  
      console.log("Sending message to content script");
      chrome.tabs.sendMessage(tabs[0].id, { action: "downloadImages" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending message to content script:", chrome.runtime.lastError.message);
        } else if (response) {
          console.log("Response from content script:", response);
        } else {
          console.warn("No response received from content script.");
        }
      });
    });
  });