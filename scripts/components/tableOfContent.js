let container =
document.querySelectorAll('.markdown-body,.wiki-wrapper')[0]

function TOC(container) {

let current = { index: 0, preIndex: -1, Li: '' },
    isClick = false,
    listHeight = [],
    calculateCurrentIndex,
    titleArr = container.querySelectorAll('h1,h2,h3,h4,h5,h6'),
    tableOfContent = document.createElement('ul'),
    initScrollHeight = titleArr[0].getBoundingClientRect().top - document.querySelector('div').getBoundingClientRect().top - 200

tableOfContent.className = 'table-of-content'

function tableOfContentStart() {
    const titleStr = getTitleStr(titleArr)

    /* 生成TOC的HTML结构 */
    generatetableOfContentHTML(titleArr, tableOfContent)(titleStr, tableOfContent)

    /* 计算需要的一些的一些数据 */
    calculateDatas()

    /* 点击TOC目录样式变化 */
    setClickStyle(tableOfContent)

    /* 父集不随子集元素滚动而滚动 */
    parentNotRoll('.table-of-content')

    /* 页面内容和TOC目录同步滚动 */
    syncRoll(tableOfContent)

    new Drag('.table-of-content-wrap')

}

/* 获取页面所有的标题然后拼接成字符串 */
const getTitleStr = element => {
    let title = []

    element.forEach(ele => {
        ele.id = ele.textContent
        title.push(ele.nodeName.toLocaleLowerCase())
    })

    return title.join('')
}


/* 页面滚动时候，tableOfContent也跟随者滚动，同步滚动 */
function syncRoll(element) {
    /* 初始化当前样式，默认是第一个 */
    setRollStyle(element, current.index)

    /* 数据监测 */
    Object.defineProperty(current, 'index', {
        set(value) {
            setRollStyle(element, value)
            TOCAutoRollCenter(value)
        }

    })

    /* 函数节流监听滚动事件 */
    document.addEventListener('scroll', throttle(e => {
        /* 点击时候也会触发滚动条事件 */
        if (!isClick) {
            calculateCurrentIndex(document.body.scrollTop - initScrollHeight)
        }
        isClick = false

    }, 200), false)

    /* TOC出现滚动条时候，激活状态的Tab要一直处于页面中间 */
    function TOCAutoRollCenter(index) {

        let oLi = element.querySelectorAll('li')
        let currentTop = oLi[index].getBoundingClientRect().top

        if (tableOfContent.scrollHeight !== tableOfContent.clientHeight) { // 此时有滚动条出现
            tableOfContent.scrollTop = currentTop - tableOfContent.clientHeight / 2
        }

    }
}

function setRollStyle(element, index) {
    /* span的个数和li一样多 */
    let oSpan = element.querySelectorAll('span')
    let Li = element.querySelectorAll('li')

    /* 点击之后如果是收起菜单栏，那么将移除上面的cssText */
    clearCssText(element)

    /* 重置所有style */
    element.querySelectorAll('span,li').forEach(ele => {

        if (ele.parentNode.className === 'table-of-content') {
            ele.toggle = false
        }
        ele.style.cssText = ''

    })

    /* 求出LI里面嵌套了几层UL */
    const cascad = getCascad()(oSpan[index])

    /* 如果是第一层的li，这个才能控制菜单栏的展开与收缩*/
    if (cascad === 1) {
        oSpan[index].parentNode.toggle = !oSpan[index].parentNode.toggle
    } else {
        let ele = oSpan[index].parentNode, // span标签的父集li
            flag = true

        while (flag) {
            ele = ele.parentNode.parentNode // li的父集ul的父集li
            if (ele.parentNode.className === 'table-of-content') {
                flag = false
            }
        }
        ele.toggle = true
    }

    /* 设置所有嵌套的li样式，递归实现 */
    setActiveStyle()(oSpan[index], cascad)
}

/* 点击之后的样式 */
function setClickStyle(element) {
    /* 点击之后如果是收起菜单栏，那么将移除上面的cssText */
    clearCssText(element)

    element.addEventListener('click', e => {
        /* 过滤所有不是span标签的元素 */
        if (e.target.nodeName !== 'SPAN') {
            return
        }

        isClick = true

        /* 一元运算符+隐式转换 */
        document.body.scrollTop = listHeight[+e.target.getAttribute('index')] + initScrollHeight

        /* 求出LI里面嵌套了几层UL */
        const cascad = getCascad()(e.target)

        /* 如果是第一层的li，这个才能控制菜单栏的展开与收缩*/
        if (cascad === 1) {
            e.target.parentNode.toggle = !e.target.parentNode.toggle
            current.Li = e.target.parentNode
        } else {
            let ele = e.target.parentNode, // span标签的父集li
                flag = true
            while (flag) {
                ele = ele.parentNode.parentNode // li的父集ul的父集li
                if (ele.parentNode.className === 'table-of-content') {
                    flag = false
                }
            }
            ele.toggle = true
            current.Li = ele
        }

        /* 重置所有style */
        element.querySelectorAll('span,li').forEach(ele => {
            if (ele.parentNode.className === 'table-of-content') {
                /* 上次点击和这次点击还是同一个目标，就过滤掉 */
                if (ele.firstChild.getAttribute('index') !== current.Li.firstChild.getAttribute('index')) {
                    ele.toggle = false
                    ele.style.cssText = ''
                } else {
                    ele.style.cssText = ''
                }
            } else {
                ele.toggle = false
                ele.style.cssText = ''
            }
        })

        /* 设置所有嵌套的li样式，递归实现 */
        setActiveStyle()(e.target, cascad)

    }, false)
}

/* 点击之后如果是收起菜单栏，那么将移除上面的cssText */
function clearCssText(element) {
    Array.prototype.slice.call(element.children).forEach(item => {
        item.toggle = false
        item.addEventListener('mouseleave', e => { // 防止冒泡

            if (item.toggle === false) {
                e.target.style.cssText = ''
            }
        }, false)
    })
}

/* 求出LI里面嵌套了几层UL */
function getCascad() {
    let count = 0
    return function(element) {
        count++
        if (element.parentNode.parentNode.className === 'table-of-content') {
            return count
        } else {
            arguments.callee(element.parentNode.parentNode.parentNode.firstChild)
        }
        return count
    }
}


/* 设置所有嵌套的li样式，递归实现 */
function setActiveStyle() {
    let flag = 0
    return function(element, cascad) {
        let cascadIndex = cascad
        flag++
        // 容器第一层的Li
        if (element.parentNode.parentNode.className === 'table-of-content') {

            /* 设置span标签父集li的样式 */
            element.parentNode.style.cssText = element.parentNode.toggle ?
                `max-height: 600px;` :
                'max-height: 26px;transition: all 0.5s ease-out;'

            /* 设置span标签样式 */
            element.style.cssText = `
    border-left: 3px solid #563d7c;
    color: #563d7c;
    padding-left: calc(1em - 3px);
    text-decoration: none;`
            return
        } else {
            /* 设置span标签父集li的样式 */
            element.parentNode.style.cssText = `max-height: 600px;`

            /* 设置span标签样式 */
            element.style.cssText = `
    border-left: 2px solid #563d7c;
    color: #563d7c;
    padding-left: calc(${2 + cascad - flag}em - 2px);
    text-decoration: none;`
            arguments.callee(element.parentNode.parentNode.parentNode.firstChild, cascadIndex)
        }
    }
}

function calculateDatas() {
    /* 把两个标题之间的内容长度算出来 */
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

    listHeight = calculateHeight()

    /* 计算当前滚动内容可视区域的index */
    calculateCurrentIndex = scrollY => {

        for (let i = 0; i < listHeight.length; i++) {
            let preHeight = listHeight[i]
            let nextHeight = listHeight[i + 1]

            if (scrollY < listHeight[0]) {
                current.index = 0
                return
            }
            if ((!nextHeight) || (scrollY >= preHeight && scrollY < nextHeight)) {
                /* 微微提高性能，只有当index改变时候才去监听，然后调用函数 */
                if (i !== current.preIndex) {
                    current.index = i
                    current.preIndex = i
                }
                return
            }
        }
    }

    /* 初始化样式 */
    calculateCurrentIndex(document.body.scrollTop)
}


/* 等图片全部加载完成再加载TOC，防止图片未加载完成造成内容坍塌 */
imagesLoaded(container, { background: true }, function() {

    /* 如果当前滚动条超过页面一半，显示TOC目录导航 */
    tableOfContentStart()

    /* TOC显示与隐藏 */
    const toggleTOC = function() {
        const wrap = document.querySelector('.table-of-content-wrap')

        if (document.body.scrollTop >= window.screen.height / 1.5) {
            wrap.style.display = 'block'
        }
        document.addEventListener('scroll', throttle(e => {

            let displayStatus = (document.body.scrollTop >= window.screen.height / 1.5) ?
                'block' : 'none'

            wrap.style.display = displayStatus
        }, 500), false)
    }()

})

}

if (container) {
TOC(container)
}

/* github进入issue界面并不会刷新页面，所以js不会重新加载 */
const hackGithub = function() {
let count = 0
document.addEventListener('scroll', throttle(e => {

    if (document.querySelectorAll('.markdown-body,.wiki-wrapper').length) {

        if (container.innerHTML !== document.querySelectorAll('.markdown-body,.wiki-wrapper')[0].innerHTML) {

            container = document.querySelectorAll('.markdown-body,.wiki-wrapper')[0]

            if (document.querySelector('.table-of-content-wrap')) {
                document.body.removeChild(document.querySelector('.table-of-content-wrap'))
            }

            TOC(container)
        }

    } else {

        if (document.querySelector('.table-of-content-wrap')) {
            count++ == 1 ? document.body.removeChild(document.querySelector('.table-of-content-wrap')) : ''
        }
    }

}, 200), false)

}()