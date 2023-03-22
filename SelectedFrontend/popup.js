function getSelectedText() {
  // Get information about the currently active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tab = tabs[0];

    // Inject JavaScript into the active tab to get the text selected by the user
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id }, // Specify a target to inject JavaScript
        function: _getSelectedTextFromTab, // Function to be injected into the target
      },
      ([res]) => {
        // If selection is not empty, populate the input textarea
        if (res["result"] !== "") {
          document.getElementById("input_text").value = res["result"];
        }
      }
    );
  });
}

// Get the selected text from the current page
function _getSelectedTextFromTab() {
  var selection = window.getSelection().toString();
  return selection;
}

document.addEventListener("DOMContentLoaded", getSelectedText);

document.addEventListener('DOMContentLoaded', function() {
    var myButton = document.getElementById('myButton');
    var myInput = document.getElementById('input_text');
	var feedbackDiv = document.getElementById('feedback');

    myButton.addEventListener('click', function() {
		var inputValue = myInput.value;
		var xmlHttp = new XMLHttpRequest();

		// Set up request
		xmlHttp.open("POST", "http://127.0.0.1:5000/input", true);
		xmlHttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');

		// Send request
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
				console.log(xmlHttp.responseText);
                // var text = myInput.value;
                // var wordSet = JSON.parse(this.responseText);
               
                // var wordSet = JSON.parse(this.responseText);
                // for (var i = 0; i < wordSet.length; i++) {
                //     var regex = new RegExp("(" + wordSet[i] + ")", "g");
                //     var match = regex.exec(text);
                //     if (match) {
                //         text = text.replace(regex, "<mark>$1</mark>");
                //         wordSet.splice(i, 1);
                //         i--; // decrement the index since the array length has decreased     
                //     } 
                // }
				feedbackDiv.innerHTML = xmlHttp.responseText; // set feedback to success message
			}
		}
		xmlHttp.send(JSON.stringify({'input': inputValue}));
    })
});

