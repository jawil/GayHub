if (window.location.pathname === '/') {
    showAvatar()
    document.querySelector('.news').addEventListener('click', ev => {
        if (ev.target.className !== 'ajax-pagination-btn') {
            return
        }
        let timer = setInterval(f => {
            if (document.querySelectorAll('.loading').length === 0) {
                clearInterval(timer)
                showAvatar()
                console.info('pagination completed')
            } else {
                console.info('waiting...')
            }
        }, 500)

    }, false)
}

// mouseover只触发一次
const onceMouseover = function() {
    let count = 0
    return function() {
        document.body.addEventListener('mouseover', e => {
            if (e.target.nodeName !== 'PRE') {
                return
            }
            (count++ === 0 && !document.querySelector('.copy-icon')) ? copySnippet(): ''
        }, false)
    }
}()

onceMouseover()