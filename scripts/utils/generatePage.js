/* 生成tableOfContent的HTML */
const generatetableOfContentHTML = function(titleArr, root) {
    let count = 0

    const tableOfContentWrap = document.createElement('div'),
        tableOfContentHeader = document.createElement('div'),
        tableOfContentLink = document.createElement('a')

    tableOfContentWrap.className = 'table-of-content-wrap'
    tableOfContentHeader.className = 'table-of-content-header'
    tableOfContentLink.href = 'https://github.com/jawil'
    tableOfContentLink.textContent = 'by jawil'
    tableOfContentLink.target='_blank'
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