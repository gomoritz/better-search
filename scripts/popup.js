const $el = (e) => document.querySelector(e)

const stackoverflowOptionButton = $el('#option__stackoverflow')

chrome.storage.sync.get(['stackoverflow'], (result) => {
    stackoverflowOptionButton.dataset.status = result.stackoverflow
    if (result.stackoverflow == 'disabled') {
        stackoverflowOptionButton.innerText = 'Enable'
    } else {
        stackoverflowOptionButton.innerText = 'Disable'
    }
})

stackoverflowOptionButton.addEventListener('click', (e) => {
    console.log(e.target.dataset)

    if (e.target.dataset.status == 'enabled') {
        e.target.dataset.status = 'disabled'
        e.target.innerText = 'Enable'
        chrome.storage.sync.set({ stackoverflow: 'disabled' }, null)
    } else {
        e.target.dataset.status = 'enabled'
        e.target.innerText = 'Disable'
        chrome.storage.sync.set({ stackoverflow: 'enabled' }, null)
    }

    chrome.tabs.reload()
})
