function createSnippet(source, title, content, favicon) {
    if (!favicon) {
        const sourceUrl = new URL(source)
        favicon = sourceUrl.protocol + '//' + sourceUrl.host + '/favicon.ico'
    }

    const snippet = document.createElement('div')
    snippet.classList.add('snippet')

    const snippetHeader = document.createElement('div')
    snippetHeader.classList.add('snippet-header')

    const snippetSource = document.createElement('div')
    snippetSource.classList.add('snippet-source')
    snippetSource.innerHTML = `
        <img src='${favicon}' alt='favicon'>
        <a href='${source}'>${source}</a>
    `

    const snippetTitle = document.createElement('a')
    snippetTitle.href = source
    snippetTitle.innerText = title
    snippetTitle.classList.add('snippet-title')

    content.classList.add('snippet-content')
    Array.from(content.getElementsByTagName('img')).forEach((element) =>
        (element as HTMLImageElement).addEventListener('click', (event) => {
            event.preventDefault()
            return (element as HTMLImageElement).classList.toggle('zoomed')
        })
    )

    snippetHeader.append(snippetSource)
    snippetHeader.append(snippetTitle)

    snippet.append(snippetHeader)
    snippet.append(content)

    const target = document.getElementById('rhs')
    if (target == null) {
        createTarget().appendChild(snippet)
    } else {
        const after = target.children[2]
        target.insertBefore(snippet, after)
    }
}

function createTarget() {
    const element = document.createElement('div')
    element.classList.add('TQc1id', 'rhstc4')
    element.id = 'rhs'

    const parent = document.getElementById('rcnt') as HTMLDivElement;
    const lastChild = parent.lastChild;

    (parent as HTMLDivElement).insertBefore(element, lastChild)
    return element
}
