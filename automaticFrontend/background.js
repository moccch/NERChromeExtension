chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var xhr = new XMLHttpRequest();
    // sendResponse({text: "Hello from background.js!"});
    xhr.open("POST", "http://localhost:5000/input");
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({
                                text: message.text
                            }));
    
    xhr.onreadystatechange = function() { 
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText);
            sendResponse({text: xhr.responseText});
        }
    }
    return true;
});

  