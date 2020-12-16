chrome.runtime.onInstalled.addListener(function () {
    chrome.webNavigation.onDOMContentLoaded.addListener(
        function (event) {
            chrome.tabs.executeScript(event.tabId, {
                file: "scripts/stackoverflow_snippets.js"
            })
        }, {
            url: [
                { urlMatches: 'https://www.google.com/' }
            ]
        }
    );

    chrome.extension.onConnect.addListener(function (port) {
        port.onMessage.addListener(async function (result) {
            console.log("Downloading HTML content from " + result.url + "...")
            const html = await fetch(result.url).then(res => res.text())
            port.postMessage({ result, html })
        })
    })
});