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
        <img src="${favicon}" alt="favicon">
        <a href="${source}">${source}</a>
    `

    const snippetTitle = document.createElement('a')
    snippetTitle.href = source
    snippetTitle.innerText = title
    snippetTitle.classList.add('snippet-title')

    content.classList.add('snippet-content')

    snippetHeader.append(snippetSource)
    snippetHeader.append(snippetTitle)

    snippet.append(snippetHeader)
    snippet.append(content)

    const target = document.getElementById('rhs')
    const after = target.children[2]
    target.insertBefore(snippet, after)
}
