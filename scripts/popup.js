const $el = (e) => document.querySelector(e)

const stackoverflowOptionButton = $el('#option__stackoverflow')

function getCurrentTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0])
        })
    })
}

/* Get stackoverflow visibility status */
chrome.storage.sync.get(['stackoverflow'], (result) => {
    stackoverflowOptionButton.dataset.status = result.stackoverflow
    if (result.stackoverflow === 'enabled') {
        stackoverflowOptionButton.innerText = 'Disable'
    } else {
        stackoverflowOptionButton.innerText = 'Enable'
    }
})

/* Set stackoverflow visibility status */
stackoverflowOptionButton.addEventListener('click', async (e) => {
    console.log(e.target.dataset)

    if (e.target.dataset.status === 'enabled') {
        e.target.dataset.status = 'disabled'
        e.target.innerText = 'Enable'
        chrome.storage.sync.set({ stackoverflow: 'disabled' }, null)
    } else {
        e.target.dataset.status = 'enabled'
        e.target.innerText = 'Disable'
        chrome.storage.sync.set({ stackoverflow: 'enabled' }, null)
    }

    const currentTab = await getCurrentTab()
    const currentUrl = new URL(currentTab.url)

    if (currentUrl.host === 'www.google.com' && currentUrl.pathname === '/search')
        chrome.tabs.reload()
})
