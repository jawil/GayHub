import axios from 'axios'
import Pjax from 'pjax'
import icons from '../icons.json'
console.log(2222222)
const iconDefinitions = icons.iconDefinitions,
    folderNames = icons.folderNames,
    folderNamesExpanded = icons.folderNamesExpanded,
    iconNames = Object.assign(icons.fileExtensions, icons.fileNames, icons.languageIds)

/* 点击页面请求数据，防止刷新 */
const pjax = function(ele) {
    ele.addEventListener('click', e => {
        e.preventDefault()
        let pjaxContainer = document.querySelector('#js-repo-pjax-container')


        axios.get(ele.href)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })

        new Pjax({
            elements: 'div[data-pjax-container]',
            selectors: ['#js-repo-pjax-container', '.context-loader-container'],
            callback: {}
        })

    }, false)
}

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

/* 点击时候样式的变化 */

const serClickCss = function(hrefA, ele, child) {

    hrefA.addEventListener('click', e => {
        e.stopPropagation()

        let onoff = hrefA.parentNode.getAttribute('onoff') === 'on' ? 'off' : 'on'

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

export { pjax, setIconCss, serClickCss }