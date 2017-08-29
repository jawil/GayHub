function copySnippet() {

    let copySnippets = document.querySelectorAll('pre')

    // 插入表示复制的icon标签
    copySnippets.forEach(ele => {
        let parent = ele.parentNode,
            copyWrap = document.createElement('div'),
            copyIcon = document.createElement('img'),
            msgTips = document.createElement('span')

        parent.replaceChild(copyWrap, ele)
        copyWrap.appendChild(ele)

        copyIcon.className = 'copy-icon'
        copyWrap.className = 'copy-wrap'
        msgTips.className = 'msg-tips'
        msgTips.textContent = '复制到剪切板'

        // 如果用链接的话，github设置的CSP安全机制会报错，所以这里图标用base64或者svg
        copyIcon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAADNElEQVR4Xu2bTXbaMBCAZxxotoYTlPeSbENvkBu0PUGTZWERcgNuAF1Al21vkJygvUGbLfQ90gsAWyD15JnWfSDLlo1Gsp2KLTCa+eZHI3mMwPzxP85eevR4TUQXiNhmFg9A9HnePbvikotcgkI5zfF0AAA9TplSWYwQ2AA0RpPvRjyeRJMJAguA5ujnEJCujXteXIABgjaAvzk/s258tKAmBG0AhXl/l7gGBG0AtnM/ILryED/FIu5ACNoAmuMp2Qz/eecU/dHkkgtCJQGEwLkgVBYAF4RKA+CAUHkAuhCUAMTePixCu0WviCIoK7qH1oRUALLevqwADo2ERABJ+3uZARwCQQogrbsrO4C8EGIAZL09EfwioD6s67fLm9ayyBqg23SJDowBEL2/NX5da4uGR4rYLoLGAYi5HwC+XXZObpMWfnYARIMCrLWW71sP/y0AMWdEEM8+AhwAofNzESAQcClg+ULE+DYoetTVAFcD9o+/rggqiyB9CVb1XlLrrJvDSf/3BzPfO94MAfBd2hrqs4BQ1PLWgGBVa9g2PjL4D4THhQOQQsB4BISPr4N1/cZ2FGy9/2IzAMTLQiPAVI5zyTUfAVyaGpLjAAh9TfxGSHMXMOQ4NrEWIsD1Aa4PsL0FlqoRcn0AW7kyI8hCETSjOJdUB8D1Afv3GwYaIZ4+IOv5Pm9qsKdAYzz5gYDnkSKc9wFZzvd5ABDQ/aJztjfArR8BwphsmQEA4Yd592RvmFsbQOxxOtN9QNbzfZ4IkD3n1AYQKlCKcVkVCYn3w7+wAAgFibVApY/N74ngbtE9fSNbkw1AaSMhwfMRDFYAodBtTQh+9wiDi93dwarHge6RvG+BdzRMm21gTQGbBnKuxR4BnMrZkOUAiJTzPh224SWTaygjQDUkZVI5UbZshlH16E6lXwxArLdXjMmpFuD83h9Pex5A+G7i9iPr7fOupx6UBHqgVf1VUfd8kUH+aNJGwK+I4P8zUrHHZ4GRbVQ2hABeH1ZHd7ZBhGEPweY1Avb3jAcAjvTMPSydhaqV3zB4X9oIRcpXtbfPCz/9hYmiXolNs4LJ84lnAenWU6HePm8EPAFlbuxfxLSfxgAAAABJRU5ErkJggg=="

        copyWrap.appendChild(copyIcon)
        copyWrap.appendChild(msgTips)
    })

    const clipboard = new Clipboard('.copy-icon', {
        target: (trigger) => {
            return trigger.parentNode.querySelector('pre');
        }
    })

    clipboard.on('success', e => {
        e.trigger.parentNode.lastChild.textContent = '已复制到剪切板'
        e.trigger.parentNode.style.cssText = 'display:block'
        e.clearSelection()
    })

    // 事件委托
    document.body.addEventListener('click', e => {
        if (e.target.className !== 'copy-icon') {
            return
        }
        e.preventDefault()
    }, false)

    document.body.addEventListener('mouseout', e => {
        if (e.target.className !== 'copy-icon') {
            return
        }
        e.target.parentNode.lastChild.textContent = '复制到剪切板'
        e.preventDefault()
    }, false)
}