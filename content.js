// This script extracts and downloads all images from <div> elements with the "data-g1-share-image" attribute
console.log("Content script loaded and running.");

// Function to extract "data-g1-share-image" attribute values
function extractImageLinks() {
    // Select all <div> elements with the "data-g1-share-image" attribute
    let divs = document.querySelectorAll('div[data-g1-share-image]');
  
    // Create an array to store the attribute values
    let attributeValues = [];
  
    // Loop through the divs and add their "data-g1-share-image" attribute values to the array
    divs.forEach(div => {
      attributeValues.push(div.getAttribute('data-g1-share-image'));
    });
  
    // Return the array of attribute values
    return attributeValues;
  }
  
  // Function to download files sequentially
  async function downloadSequentially(links) {
    for (const link of links) {
      try {
        const response = await fetch(link);
        const blob = await response.blob();
        const filename = link.split('/').pop();
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.style.display = 'none';
        anchor.href = url;
        anchor.download = filename;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error(`Failed to download ${link}: ${error}`);
      }
    }
  }

  function clickOpenAlbum() {
    const span = Array.from(document.querySelectorAll('span')).find(el => el.textContent === "Mở album");
    if (span) {
      span.click();
      console.log("Clicked 'Mở album' span");
      return true;
    } else {
      console.error("'Mở album' span not found");
      return false;
    }
  }
  
  // Listener for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message from background script:", request);
  
    if (request.action === "downloadImages") {
      if (clickOpenAlbum()) {
        setTimeout(() => {
          (async () => {
            const imageLinks = extractImageLinks();
            console.log("Extracted image links:", imageLinks);
  
            if (imageLinks.length === 0) {
              sendResponse({ success: false, message: "No images found." });
              return;
            }
  
            await downloadSequentially(imageLinks);
            sendResponse({ success: true, message: "Images downloaded." });
          })();
        }, 2000); // Adjust the delay as needed
      } else {
        sendResponse({ success: false, message: "'Mở album' span not found." });
      }
      return true; // Keeps the message channel open for async response
    }
  });