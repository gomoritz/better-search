const extensionId = chrome.runtime.id
const port = chrome.extension.connect({
    name: "stackoverflow-fetcher"
})

let syntaxScriptInjected = false
let syntaxScriptTries = 0

port.onMessage.addListener(function (data) {
    const pseudo = document.createElement("html")
    pseudo.innerHTML = data.html

    const questionTitle = pseudo.getElementsByClassName("question-hyperlink")[0].textContent;
    const preferredAnswer = pseudo.getElementsByClassName("accepted-answer").length > 0
        ? pseudo.getElementsByClassName("accepted-answer")[0]
        : pseudo.getElementsByClassName("answer").length > 0
            ? pseudo.getElementsByClassName("answer")[0]
            : null

    if (preferredAnswer == null) {
        console.log("No answer found, going for next stackoverflow result...")
        execute(data.result.index + 1)
        return
    }

    const answerElement = document.createElement("div")
    answerElement.classList.add("answer")

    const answerHeader = document.createElement("div")
    answerHeader.classList.add("answer-header")

    const sourceElement = document.createElement("div")
    sourceElement.classList.add("source")
    sourceElement.innerHTML = `
        <img src="https://stackoverflow.com/favicon.ico">
        <a href="${data.result.url}">${data.result.url}</a>
    `

    const answerTitleElement = document.createElement("a")
    answerTitleElement.href = data.result.url
    answerTitleElement.innerText = questionTitle
    answerTitleElement.classList.add("answer-title")

    const answerContent = preferredAnswer.getElementsByClassName("s-prose")[0]
    answerContent.classList.add("answer-content")

    answerHeader.append(sourceElement)
    answerHeader.append(answerTitleElement)

    answerElement.append(answerHeader)
    answerElement.append(answerContent)

    for (let element of answerElement.getElementsByTagName("pre")) {
        const copy = document.createElement("span")
        copy.classList.add("copy-icon")
        copy.innerText = "📝"
        copy.onclick = async () => {
            const code = element.getElementsByTagName("code")[0]
            const content = code.textContent
            await navigator.clipboard.writeText(content.substring(0, content.length - 1))
        }
        element.append(copy)
    }

    const target = document.getElementById("rhs")
    const after = target.children[2];
    target.insertBefore(answerElement, after)

    syntaxHighlighting()

    console.log("Found stackoverflow post: " + data.result.title)
})

function syntaxHighlighting() {
    console.log("> Trying to enable syntax highlighting")

    syntaxScriptTries++
    if (syntaxScriptTries > 50)
        return console.log("! Failed to many times, aborting...")

    if (syntaxScriptInjected) {
        const s = document.createElement('script');
        document.head.appendChild(s);
        s.innerHTML = "hljs.initHighlighting()"
        console.log("+ Syntax highlighting enabled")
    } else {
        setTimeout(() => {
            syntaxHighlighting()
        }, 100)
    }
}

function execute(_startIndex) {
    let startIndex = _startIndex || 0
    const pathName = window.location.pathname
    if (pathName !== "/search") return console.log("No search was performed")

    const queryString = window.location.search
    const urlSearchParams = new URLSearchParams(queryString)

    if (!urlSearchParams.has("q")) return console.log("No search param found")

    const results = [].slice.call(document.getElementsByClassName("yuRUbf"))
        .map(element => {
            const children = [].slice.call(element.firstChild.children)
            return {
                url: element.firstChild.href,
                title: children[1].textContent,
                element: element
            }
        })

    for (let index = 0; index < results.length; index++) {
        results[index].index = index
    }

    while (startIndex > 0) {
        results.splice(0, 1)
        startIndex--
    }

    const targetResult = results.find(res => new URL(res.url).host === "stackoverflow.com")
    if (targetResult === undefined) return console.log("No result from stackoverflow")

    port.postMessage(targetResult)
}

function injectScript(src, onload, onerror) {
    const s = document.createElement('script');
    if (onerror) s.onerror = onerror
    if (onload) s.onload = onload
    document.head.appendChild(s)
    s.src = src
}

function injectStylesheet(href) {
    const s = document.createElement('link');
    s.setAttribute('rel', 'stylesheet');
    s.setAttribute('href', href);
    document.body.appendChild(s);
}

injectScript("//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/highlight.min.js", () => {
    syntaxScriptInjected = true
    console.log("The script has been injected!")
})
injectStylesheet('//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.4.1/styles/atom-one-dark.min.css')

injectStylesheet(`chrome-extension://${extensionId}/stylesheets/stackoverflow_snippets.css`)
injectStylesheet(`chrome-extension://${extensionId}/stylesheets/google_darkmode.css`)

execute()