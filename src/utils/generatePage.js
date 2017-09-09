import { getUrlParam } from 'utils/sideBarHelp'

const oParam = getUrlParam()

/* 生成侧边栏sidebar的HTML */
function generateContainerHTML() {

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
    <div class="side-bar-header-branch">${decodeURIComponent(oParam.branch)}</div>
    </div>
    <div id="spinner">
    <div class="spinner-container container1">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
    </div>
    <div class="spinner-container container2">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
    </div>
    <div class="spinner-container container3">
        <div class="circle1"></div>
        <div class="circle2"></div>
        <div class="circle3"></div>
        <div class="circle4"></div>
    </div>
</div>
`

    sideBarHeader.innerHTML = headerHTML
    sideBarWrap.appendChild(toggleBtn)
    sideBarWrap.appendChild(sideBarHeader)
    sideBarWrap.appendChild(sideBarMain)

    document.body.appendChild(sideBarWrap)

    let contentMain = document.querySelector('.repository-content'),
        react = contentMain.getBoundingClientRect().left,
        rootHtml = document.querySelector('html')

    rootHtml.style.marginLeft = Math.max((370 - react), 0) + 'px'

    sideBarWrap.setAttribute('toggle', 'on')

    return sideBarMain
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

export { generateContainerHTML, generatetableOfContentHTML }