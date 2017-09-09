/* 侧边栏功能 */
const fileWrap = document.querySelectorAll('.file-wrap,.file')

if (fileWrap.length) {
    const siderBar = require('components/sideBar')
    siderBar()
}

/* 用户图像 */
if (window.location.pathname === '/') {
    const showAvatar = require('components/showAvatar')
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

/* 复制代码 */
const copySnippet = require('components/copySnippet')
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


/* TOC展示 */
const webClassContainer = {
    github: ['.markdown-body', '.wiki-wrapper'],
    juejin: ['.entry-content']
}
const selectorStr = function(obj) {
    let selectorArr = []

    for (let attr in obj) {
        selectorArr = selectorArr.concat(obj[attr])
    }

    return selectorArr.join(',')

}(webClassContainer)

let container = document.querySelectorAll(selectorStr)[0]
if (container && container.querySelectorAll('h1,h2,h3,h4,h5,h6').length) {
    const TOC = require('components/tableOfContent')
}


/* 点击放大图片 */
if (container && container.querySelectorAll('img').length) {
    const imageZoom = require('components/imageZoom')
    imageZoom(container)
}