import icons from '../icons.json'

const iconDefinitions = icons.iconDefinitions,
    folderNames = icons.folderNames,
    folderNamesExpanded = icons.folderNamesExpanded,
    iconNames = Object.assign(icons.fileExtensions, icons.fileNames, icons.languageIds)

/* 当前页面获取所有的文件类型 */
const getAllFiletype = function(files) {
    let allFileTypes = []

    files.forEach(ele => {
        let type = ele.type === 'blob' ? ele.path.split('.').pop() : 'folder'
        allFileTypes.push(type)
    })

    allFileTypes = [...new Set(allFileTypes)]
    return allFileTypes
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
        console.log(111)
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

export { getAllFiletype, setIconCss, serClickCss }