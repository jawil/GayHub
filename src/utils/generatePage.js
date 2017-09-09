import { generateCurrentTreeDOM } from 'utils/sideBarHelp'

/* 生成侧边栏sidebar的HTML */
function generatePath(files, parent, oParam) {

    let sideBarWrap = document.createElement('div')
    sideBarWrap.className = 'side-bar-wrap'

    let toggleBtn = document.createElement('a')
    toggleBtn.className = 'toggle-btn'

    let sideBarMain = document.createElement('ul')
    sideBarMain.className = 'side-bar-main'

    let sideBarHeader = document.createElement('div')
    sideBarHeader.className = 'side-bar-header'

    let headerHTML = `
    <div class="side-bar-header">
    <div class="side-bar-header-repo">
    <a href="/${oParam.userName}">${oParam.userName}</a> / 
    <a type="blob" href="/${oParam.userName}/${oParam.reposName}">${oParam.reposName}</a>
    </div>
    <div class="side-bar-header-branch">${oParam.branch}</div>
    </div>`

    sideBarHeader.innerHTML = headerHTML

    sideBarWrap.appendChild(toggleBtn)
    sideBarWrap.appendChild(sideBarHeader)
    sideBarWrap.appendChild(sideBarMain)


    parent.appendChild(sideBarWrap)

    let lastCount = files[0].path.split('/').length + 1

    /* 默认开始时候生成两层目录 */

    generateCurrentTreeDOM(files, sideBarMain, 2, files)


}



/* 生成tableOfContent的HTML */
function generatetableOfContentHTML(titleArr, root) {
    let count = 0

    const tableOfContentWrap = document.createElement('div'),
        tableOfContentHeader = document.createElement('div'),
        tableOfContentLink = document.createElement('a'),
        toggleBtn = document.createElement('a')

    toggleBtn.className = 'table-of-content-btn'
    tableOfContentLink.className = 'table-of-content-auth'
    tableOfContentWrap.className = 'table-of-content-wrap'
    tableOfContentWrap.setAttribute('toggle', 'on')
    tableOfContentHeader.className = 'table-of-content-header'

    tableOfContentLink.href = 'https://github.com/jawil'
    tableOfContentLink.textContent = 'by jawil'
    tableOfContentLink.target = '_blank'
    tableOfContentHeader.textContent = 'Table of Content'
    tableOfContentHeader.appendChild(tableOfContentLink)
    tableOfContentWrap.appendChild(toggleBtn)
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