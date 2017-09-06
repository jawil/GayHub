/* 设置侧边栏样式模块 */
import { setIconCss, serClickCss, pjax } from 'utils/setIconStyle'

/* 生成侧边栏sidebar的HTML */
function generatePath(files, parent, url) {
    let sideBarWrap = document.createElement('ul')
    sideBarWrap.className = 'side-bar-wrap'
    parent.appendChild(sideBarWrap)

    /* 默认从第1级目录开始 */
    ! function(currentFiles, parent) {
        let count = currentFiles[0].path.split('/').length

        currentFiles.forEach(ele => {
            let cascading = ele.path.split('/').length

            if (count === cascading) {
                let outerLi = document.createElement('li')
                let iconI = document.createElement('i')
                let hrefA = document.createElement('a')

                if (ele.type === 'blob') {
                    hrefA.href = `${url}/${ele.path}`
                    pjax(hrefA)
                }

                /* 设置相对应的图标 */
                setIconCss(ele, iconI)
                hrefA.textContent = ele.path.split('/').pop()
                outerLi.setAttribute('type', ele.type)

                outerLi.appendChild(iconI)
                outerLi.appendChild(hrefA)

                if (ele.type === 'blob') {
                    parent.appendChild(outerLi)
                } else {
                    const firstBlobChild = function() {
                        const childrenArr = Array.from(parent.children)
                        for (let eleLi of childrenArr) {

                            if (eleLi.getAttribute('type') === 'blob') {
                                return eleLi
                            }

                        }
                        return null
                    }()
                    parent.insertBefore(outerLi, firstBlobChild)
                }

                /* 求出tree文件下所有的文件 */
                if (ele.type == 'tree') {

                    let oSpan = document.createElement('span')
                    outerLi.insertBefore(oSpan, iconI)

                    /* 默认文件夹都是收缩的 */
                    outerLi.setAttribute('onoff', 'off')

                    serClickCss(hrefA, ele, iconI)

                    let oUl = document.createElement('ul')
                    outerLi.appendChild(oUl)

                    const getCurrentFiles = function() {
                        let arr = []
                        files.forEach(item => {
                            let current = item.path.split('/').length
                            if (new RegExp(`${ele.path}`).test(item.path) && (count + 1 === current)) {
                                arr.push(item)
                            }
                        })
                        return arr
                    }()
                    arguments.callee(getCurrentFiles, oUl)
                }
            }
        })
    }(files, sideBarWrap)

}



/* 生成tableOfContent的HTML */
function generatetableOfContentHTML(titleArr, root) {
    let count = 0

    const tableOfContentWrap = document.createElement('div'),
        tableOfContentHeader = document.createElement('div'),
        tableOfContentLink = document.createElement('a')

    tableOfContentWrap.className = 'table-of-content-wrap'
    tableOfContentHeader.className = 'table-of-content-header'
    tableOfContentLink.href = 'https://github.com/jawil'
    tableOfContentLink.textContent = 'by jawil'
    tableOfContentLink.target = '_blank'
    tableOfContentHeader.textContent = 'Table of Content'
    tableOfContentHeader.appendChild(tableOfContentLink)
    tableOfContentWrap.appendChild(tableOfContentHeader)
    tableOfContentWrap.appendChild(root)
    document.body.appendChild(tableOfContentWrap)

    return function(str, parent) {
        let h = str[1] - 1,
            reg = [
                /h1.*?(?=(h1)|\b)/g,
                /h2.*?(?=(h2)|\b)/g,
                /h3.*?(?=(h3)|\b)/g,
                /h4.*?(?=(h4)|\b)/g,
                /h5.*?(?=(h5)|\b)/g,
                /h6.*?(?=(h6)|\b)/g
            ][h]

        let titleGroup = str.match(reg)

        titleGroup.forEach(item => {
            let outLi = document.createElement('li')
            let oSpan = document.createElement('span')

            oSpan.textContent = titleArr[count].textContent
            oSpan.setAttribute('index', count)

            outLi.appendChild(oSpan)
            count++
            parent.appendChild(outLi)
            let ele = item.substr(2)

            if (ele.length === 0) {
                return
            } else {

                let oUl = document.createElement('ul')
                let oLi = document.createElement('li')
                outLi.appendChild(oUl)
                parent.appendChild(outLi)
                arguments.callee(ele, oUl, root)

            }
        })
    }
}

export { generatePath, generatetableOfContentHTML }