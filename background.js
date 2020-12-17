chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(async function (result) {
        console.log('Downloading HTML content from ' + result.url + '...')
        const html = await fetch(result.url).then((res) => res.text())
        port.postMessage({ result, html })
    })
})

// set default settings when the extension is installed
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.storage.sync.set({ stackoverflow: 'enabled' })
    }
})
