import icons from '../icons.json'

const iconDefinitions = icons.iconDefinitions,
    folderNames = icons.folderNames,
    folderNamesExpanded = icons.folderNamesExpanded,
    iconNames = Object.assign(icons.fileExtensions, icons.fileNames, icons.languageIds)

/* 设置所有图标样式 */
const setIconCss = function(ele, iconELe) {

    let oPath = {}
    let typeName = ele.path.split('/').pop().toLocaleLowerCase()

    if (ele.type === 'tree') {
        oPath = folderNames.hasOwnProperty(typeName) ?
            iconDefinitions[folderNames[typeName]].iconPath : 'icons/folder.png'
    } else {
        if (iconNames.hasOwnProperty(typeName)) {
            oPath = iconDefinitions[iconNames[typeName]].iconPath
        } else {
            typeName = ele.path.split('.').pop().toLocaleLowerCase()
            oPath = iconNames.hasOwnProperty(typeName) ?
                iconDefinitions[iconNames[typeName]].iconPath : 'icons/file.png'
        }
    }

    let bgcUrl = chrome.extension.getURL(`${oPath}`)
    iconELe.style.cssText = `background: url(${bgcUrl});
    background-size: cover;`
}

/* 获取当前的文件名称 */
const getCurrentPath = function() {
    const pathname = window.location.pathname,
        parseParam = pathname.replace(/^\//, '').split('/')
    let currentPath = ''

    if (parseParam[2]) {
        currentPath = parseParam.slice(4)
        currentPath = currentPath.length === 1 ? currentPath[0] : currentPath.join('/')
    }
    return currentPath
}

/* 监听URL变化，改变侧边栏对应的样式变化 */
const urlChangeEvent = function() {

    const fileWrap = document.querySelectorAll('.file-wrap,.file')

    if (fileWrap.length) {

        document.querySelector('div[role=main]').addEventListener('click', e => {

            if (e.target.nodeName === 'A' && !e.target.getAttribute('data-pjax')) {
                const href = e.target.href

                let sideBarWrap = document.querySelector('.side-bar-wrap')

                let eleAs = sideBarWrap.querySelectorAll('a')

                let targetA = ''

                for (let ele of eleAs) {
                    if (ele.getAttribute('data-href') === href) {
                        targetA = ele
                        break
                    }
                }

                let sideBarContainer = document.querySelector('.side-bar-main')

                sideBarContainer.querySelectorAll('a').forEach(ele => {
                    ele.setAttribute('isClicked', false)
                })

                if (targetA) {
                    if (targetA.getAttribute('type') === 'blob') {
                        targetA.setAttribute('isClicked', true)
                    } else {
                        setTimeout(f => {
                            targetA.parentNode.setAttribute('onoff', 'on')
                        }, 1000)

                    }
                }

            }
        }, false)
    }

}

const toggleBtn = function() {
    let oBtn = document.querySelector('.toggle-btn')
    let sideBarWrap = document.querySelector('.side-bar-wrap')

    let contentMain = document.querySelector('.repository-content')
    let react = contentMain.getBoundingClientRect().left

    document.querySelector('html').style.marginLeft = Math.max((370 - react), 0) + 'px'

    oBtn.addEventListener('click', e => {

        let onoff = sideBarWrap.getAttribute('toggle') === 'off' ? 'on' : 'off'

        if (onoff == 'on') {
            document.querySelector('html').style.marginLeft = Math.max((370 - react), 0) + 'px'

        } else {

            let TOCWrap = document.querySelector('.table-of-content-wrap')
            let currentStyle = TOCWrap ? window.getComputedStyle(TOCWrap, null)['display'] : 'none'

            if (TOCWrap && (TOCWrap.getAttribute('toggle') === 'on') && currentStyle == 'block') {

                document.querySelector('html').style.marginLeft = -Math.max((420 - react), 0) + 'px'

            } else {

                document.querySelector('html').style.marginLeft = 0 + 'px'

            }

        }

        sideBarWrap.setAttribute('toggle', onoff)
    }, false)
}

const setClickBlobCss = function(hrefA) {

    hrefA.addEventListener('click', e => {
        let sideBarWrap = document.querySelector('.side-bar-main')

        sideBarWrap.querySelectorAll('a').forEach(ele => {
            ele.setAttribute('isClicked', false)
        })
        hrefA.setAttribute('isClicked', true)
    }, false)
}


/* 点击时候样式的变化 */
const setClickTreeCss = function(hrefA, ele, child) {

    hrefA.addEventListener('click', e => {
        e.stopPropagation()
        let onoff = hrefA.parentNode.getAttribute('onoff') === 'on' ? 'off' : 'on'
        let sideBarWrap = document.querySelector('.side-bar-main')
        let oPath = {}
        let typeName = ele.path.split('/').pop().toLocaleLowerCase()

        if (onoff === 'off') {
            oPath = folderNames.hasOwnProperty(typeName) ?
                iconDefinitions[folderNames[typeName]].iconPath : 'icons/folder.png'
        } else {
            oPath = folderNamesExpanded.hasOwnProperty(typeName) ?
                iconDefinitions[folderNamesExpanded[typeName]].iconPath : 'icons/folder-outline.png'
        }

        let bgcUrl = chrome.extension.getURL(`${oPath}`)
        child.style.cssText = `background: url(${bgcUrl});
        background-size: cover;`

        hrefA.parentNode.setAttribute('onoff', onoff)
    })
}

export {
    setIconCss,
    setClickTreeCss,
    setClickBlobCss,
    getCurrentPath,
    toggleBtn,
    urlChangeEvent
}