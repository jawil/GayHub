let count = 0,
    n = 0,
    titleArr

if (document.querySelector('.edit-comment-hide')) {
    titleArr = document.querySelector('.edit-comment-hide').
    querySelectorAll('h1,h2,h3,h4,h5,h6')

    tableOfContent()
}

function tableOfContent() {
    let tableOfContentWrap = document.createElement('ul')
    tableOfContentWrap.className = 'table-of-content-wrap'
    let title = []

    titleArr.forEach((ele, index) => {
        ele.id = ele.textContent
        title.push(ele.nodeName.toLocaleLowerCase())
    })

    generatetableOfContentHTML(title.join(''), tableOfContentWrap)
    document.body.appendChild(tableOfContentWrap)

    // initStyle(tableOfContentWrap)
    clickStyle(tableOfContentWrap)
    parentNotRoll('.table-of-content-wrap')
    syncScroll(tableOfContentWrap)
}



/* 页面滚动时候，tableOfContent也跟随者滚动，同步滚动 */
function syncScroll(element) {

    let scrollHeight = { 'Y': 0 }

    const calculateHeight = f => {
        let listHeight = []
        let height = 0
        let oldReactTop = titleArr[0].getBoundingClientRect().top

        titleArr.forEach(ele => {
            let react = ele.getBoundingClientRect()
            height += react.top - oldReactTop
            oldReactTop = react.top
            listHeight.push(height)
        })

        return listHeight
    }

    const listHeight = calculateHeight()

    const calculateCurrentIndex = scrollY => {

        listHeight.forEach((ele, index, array) => {
            let preHeight = array[index]
            let nextHeight = array[index + 1]

            if (scrollY >= preHeight && scrollY < nextHeight) {
                scrollStyle(element, index)
                console.log(index)

            } else if (!nextHeight) {

            } else {

            }
        })
    }

    calculateCurrentIndex(0) // 初始化 

    Object.defineProperty(scrollHeight, 'Y', {
        set(value) {
            calculateCurrentIndex(value)
        }
    })


    document.addEventListener('scroll', throttle(e => {
        scrollHeight.Y = document.body.scrollTop
    }, 300), false)
}

function scrollStyle(element, index) {

    let A = element.querySelectorAll('a')
    let Li = element.querySelectorAll('li')

    element.querySelectorAll('a,li').forEach(ele => {
        if (ele.parentNode.nodeName === 'table-of-content-wrap') {
            ele.toggle = false
        }
        ele.style.cssText = ''
    })

    let flag = 0,
        count = 0

    /* 重置所有style */
    element.querySelectorAll('a,li').forEach(ele => {
        if (ele.parentNode.nodeName === 'table-of-content-wrap') {
            ele.toggle = false
        }
        ele.style.cssText = ''
    })

    /* 求出LI里面嵌套了几层UL */
    const cascad = (function(element) {
        count++
        if (element.parentNode.parentNode.className === 'table-of-content-wrap') {
            return count
        } else {
            arguments.callee(element.parentNode.parentNode.parentNode.firstChild)
        }
        return count
    })(A[index])


    /* 如果是第一层的li，这个才能控制菜单栏的展开与收缩*/
    if (cascad === 1) {
        A[index].parentNode.toggle = !A[index].parentNode.toggle
    } else {

        let ele = A[index].parentNode, // a标签的父集li
            flag = true

        while (flag) {
            ele = ele.parentNode.parentNode // li的父集ul的父集li
            if (ele.parentNode.className === 'table-of-content-wrap') {
                flag = false
            }
        }
        ele.toggle = true
    }

    /* 设置所有嵌套的li样式，递归实现 */
    const setStyle = (function(element) {
        flag++
        // 容器第一层的Li
        if (element.parentNode.parentNode.className === 'table-of-content-wrap') {

            /* 设置a标签父集li的样式 */
            element.parentNode.style.cssText = element.parentNode.toggle ?
                `max-height: 600px;` :
                'max-height: 26px;transition: all 0.5s ease-out;'

            /* 设置a标签样式 */
            element.style.cssText = `
            border-left: 3px solid #563d7c;
            color: #563d7c;
            padding-left: calc(1em - 3px);
            text-decoration: none;`
            return

        } else {

            /* 设置a标签父集li的样式 */
            element.parentNode.style.cssText = `max-height: 600px;`

            /* 设置a标签样式 */
            element.style.cssText = `
            border-left: 2px solid #563d7c;
            color: #563d7c;
            padding-left: calc(${2 + cascad - flag}em - 2px);
            text-decoration: none;`
            arguments.callee(element.parentNode.parentNode.parentNode.firstChild)
        }
    })(A[index])

}

/* 点击之后的样式 */
function clickStyle(element) {

    /* 点击之后如果是收起菜单栏，那么将移除上面的cssText */
    Array.prototype.slice.call(element.children).forEach(item => {
        item.toggle = false
        item.addEventListener('mouseleave', e => { // 防止冒泡

            if (item.toggle === false) {
                e.target.style.cssText = ''
            }
        }, false)
    })

    element.addEventListener('click', e => {
        let flag = 0,
            count = 0

        /* 过滤所有不是A标签的元素 */
        if (e.target.nodeName !== 'A') {
            return
        }

        /* 重置所有style */
        element.querySelectorAll('a,li').forEach(ele => {
            if (ele.parentNode.nodeName === 'table-of-content-wrap') {
                ele.toggle = false
            }
            ele.style.cssText = ''
        })

        /* 求出LI里面嵌套了几层UL */
        const cascad = (function(element) {
            count++
            if (element.parentNode.parentNode.className === 'table-of-content-wrap') {
                return count
            } else {
                arguments.callee(element.parentNode.parentNode.parentNode.firstChild)
            }
            return count
        })(e.target)

        /* 如果是第一层的li，这个才能控制菜单栏的展开与收缩*/
        if (cascad === 1) {
            e.target.parentNode.toggle = !e.target.parentNode.toggle
        } else {

            let ele = e.target.parentNode, // a标签的父集li
                flag = true

            while (flag) {
                ele = ele.parentNode.parentNode // li的父集ul的父集li
                if (ele.parentNode.className === 'table-of-content-wrap') {
                    flag = false
                }
            }
            ele.toggle = true
        }

        /* 设置所有嵌套的li样式，递归实现 */
        const setStyle = (function(element) {
            flag++
            // 容器第一层的Li
            if (element.parentNode.parentNode.className === 'table-of-content-wrap') {

                /* 设置a标签父集li的样式 */
                element.parentNode.style.cssText = element.parentNode.toggle ?
                    `max-height: 600px;` :
                    'max-height: 26px;transition: all 0.5s ease-out;'

                /* 设置a标签样式 */
                element.style.cssText = `
                border-left: 3px solid #563d7c;
                color: #563d7c;
                padding-left: calc(1em - 3px);
                text-decoration: none;`
                return

            } else {

                /* 设置a标签父集li的样式 */
                element.parentNode.style.cssText = `max-height: 600px;`

                /* 设置a标签样式 */
                element.style.cssText = `
                border-left: 2px solid #563d7c;
                color: #563d7c;
                padding-left: calc(${2 + cascad - flag}em - 2px);
                text-decoration: none;`
                arguments.callee(element.parentNode.parentNode.parentNode.firstChild)

            }
        })(e.target)
    }, false)
}

/* 初始化样式 */
function initStyle(parent) {
    let firstLI = parent.firstChild
    let active = ++n === 1 ?
        `border-left: 3px solid #563d7c;
        color: #563d7c;
        padding-left: calc(1em - 3px);
        text-decoration: none;` :
        `border-left: 2px solid #563d7c;
        color: #563d7c;
        padding-left: calc(${1+n}em - 2px);
        text-decoration: none;`

    firstLI.querySelectorAll('a')[0].style.cssText = active
    let eleNode = firstLI.children[1]

    if (eleNode) {
        arguments.callee(eleNode)
    } else {
        return
    }
}

/* 生成tableOfContent的HTML */
function generatetableOfContentHTML(str, parent) {
    let h = str[1] - 1,
        reg = [
            /h1.*?(?=(h1)|\b)/g,
            /h2.*?(?=(h2)|\b)/g,
            /h3.*?(?=(h3)|\b)/g,
            /h4.*?(?=(h4)|\b)/g,
            /h5.*?(?=(h5)|\b)/g,
            /h6.*?(?=(h6)|\b)/g
        ][h]

    let group = str.match(reg)

    group.forEach(item => {
        let outLi = document.createElement('li')
        let oA = document.createElement('a')

        oA.textContent = titleArr[count].textContent
        oA.setAttribute('index', count)
        oA.href = `#${titleArr[count].textContent}`

        outLi.appendChild(oA)
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
            arguments.callee(ele, oUl)

        }
    })
}