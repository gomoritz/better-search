const $el = (e) => document.querySelector(e)

const stackoverflowOptionButton = $el('#option__stackoverflow')
const designOptionButton = $el('#option__theme')

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

    if (currentUrl.host === 'www.google.com' && currentUrl.pathname === '/search') { // @ts-ignore
        chrome.tabs.reload()
    }
})

/* Get design visibility status */
// @ts-ignore
chrome.storage.sync.get(['darkDesign'], (result) => {
    designOptionButton.dataset.status = result.design
    if (result.darkDesign === 'enabled') {
        designOptionButton.innerText = 'Disable'
    } else {
        designOptionButton.innerText = 'Enable'
    }
})

/* Set stackoverflow visibility status */
designOptionButton.addEventListener('click', async (e) => {
    console.log(e.target.dataset)

    if (e.target.dataset.status === 'enabled') {
        console.log("Disabling...")

        e.target.dataset.status = 'disabled'
        e.target.innerText = 'Enable'
        // @ts-ignore
        chrome.storage.sync.set({ darkDesign: 'disabled' }, null)

        document.documentElement.style.setProperty('--color-bg', '#ffffff')
        document.documentElement.style.setProperty('--color-fg', '#2a2a2a')
    } else {
        e.target.dataset.status = 'enabled'
        e.target.innerText = 'Disable'
        // @ts-ignore
        chrome.storage.sync.set({ darkDesign: 'enabled' }, null)

        document.documentElement.style.setProperty('--color-bg', '#2a2a2a')
        document.documentElement.style.setProperty('--color-fg', '#c6c6c6')
    }

})

// @ts-ignore
chrome.storage.sync.get(['darkDesign'], (result) => {
    console.log('Value of darkDesign currently is ' + result.darkDesign)
    if (result.darkDesign == 'enabled') {
        document.documentElement.style.setProperty('--color-bg', '#2a2a2a')
        document.documentElement.style.setProperty('--color-fg', '#c6c6c6')
    }else {
        document.documentElement.style.setProperty('--color-bg', '#ffffff')
        document.documentElement.style.setProperty('--color-fg', '#2a2a2a')
    }
})