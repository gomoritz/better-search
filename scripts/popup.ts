const $el = (e) => document.querySelector(e)

const stackoverflowOptionButton = $el('#option__stackoverflow')

function getCurrentTab() {
    return new Promise((resolve, reject) => {
        // @ts-ignore
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs[0])
        })
    })
}

/* Get stackoverflow visibility status */
// @ts-ignore
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
        // @ts-ignore
        chrome.storage.sync.set({ stackoverflow: 'disabled' }, null)
    } else {
        e.target.dataset.status = 'enabled'
        e.target.innerText = 'Disable'
        // @ts-ignore
        chrome.storage.sync.set({ stackoverflow: 'enabled' }, null)
    }

    const currentTab = await getCurrentTab()
    // @ts-ignore
    const currentUrl = new URL((currentTab as chrome.tabs.Tab).url)

    if (currentUrl.host === 'www.google.com' && currentUrl.pathname === '/search')
        { // @ts-ignore
            chrome.tabs.reload()
        }
})
