
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchSchedule") {
      fetch(request.url)
        .then(response => response.json())
        .then(data => sendResponse({ data }))
        .catch(error => sendResponse({ error: error.message }));
      return true; 
    }
    if (request.action === "fetchFaculties") {
      fetch(request.url)
        .then(response => response.json())
        .then(data => sendResponse({ data }))
        .catch(error => sendResponse({ error: error.message }));
      return true; 
    }
  });