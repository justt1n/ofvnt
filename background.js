chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.sendMessage(
      tab.id,
      { action: "downloadImages" },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error communicating with content script:", chrome.runtime.lastError.message);
        } else if (response) {
          console.log(response.message);
        } else {
          console.warn("No response received from content script.");
        }
      }
    );
  });