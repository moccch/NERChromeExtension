chrome.runtime.sendMessage({ text: document.body.innerText }, function (response) {
    const wordsToHighlight = JSON.parse(response.text);
    console.log(wordsToHighlight);

    function createHighlightSpan(text, word) {
        const span = document.createElement('span');
        span.className = 'highlighted-word';
        span.textContent = word;
        return span;
    }

    function highlightTextNode(textNode, word) {
        const nodeValue = textNode.nodeValue;
        const regex = new RegExp('\\b(' + word + ')\\b', 'gi');
        let match;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        while ((match = regex.exec(nodeValue)) !== null) {
            const matchedWord = match[1];
            const index = match.index;

            if (index > lastIndex) {
                fragment.appendChild(document.createTextNode(nodeValue.substring(lastIndex, index)));
            }

            fragment.appendChild(createHighlightSpan(textNode, matchedWord));
            lastIndex = index + matchedWord.length;
        }

        if (lastIndex < nodeValue.length) {
            fragment.appendChild(document.createTextNode(nodeValue.substring(lastIndex)));
        }

        return fragment;
    }

    function highlightWordsInNode(node, word) {
        const textNodes = [];

        function getTextNodes(element) {
            for (const child of element.childNodes) {
                if (child.nodeType === Node.TEXT_NODE) {
                    textNodes.push(child);
                } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'A') {
                    getTextNodes(child);
                }
            }
        }

        getTextNodes(node);

        for (const textNode of textNodes) {
            if (textNode.nodeValue.trim() !== '') {
                const newNode = highlightTextNode(textNode, word);
                textNode.replaceWith(newNode);
            }
        }
    }

    function highlightWords(word) {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          .highlighted-word {
            background-color: yellow;
            padding: 2px;
          }
        `;
        document.head.appendChild(styleElement);

        highlightWordsInNode(document.body, word);
    }

    // Replace 'wordToHighlight' with the word you want to highlight
    for (var i = 0; i < wordsToHighlight.length; i++) {
        highlightWords(wordsToHighlight[i]);
    }
    
});





