chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(async function (result) {
        console.log("Downloading HTML content from " + result.url + "...")
        const html = await fetch(result.url).then(res => res.text())
        port.postMessage({ result, html })
    })
})