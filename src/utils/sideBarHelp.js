import { setIconCss, setClickTreeCss, setClickBlobCss, getCurrentPath } from 'utils/setIconStyle'

/* 根据浏览器的url解析参数 */
const getUrlParam = function() {
    const pathname = window.location.pathname
    const parseParam = pathname.replace(/^\//, '').split('/')

    const oParam = {
        userName: '',
        reposName: '',
        type: '',
        branch: ''
    }
    oParam.userName = parseParam[0]
    oParam.reposName = parseParam[1]
    oParam.type = parseParam[2] ? `${parseParam[2]}` : 'tree'
    oParam.branch = parseParam[3] ? `${parseParam[3]}` : 'master'

    return oParam
}


/**
 * 高效找出当前文件夹所有符合条件的文件
 * @param {type:Object} fileTree 
 * @param {type:Array} allFiles 
 * @param {type:Number} cascad 
 */
const getCurrentTreeFiles = function(fileTree, allFiles, cascad) {

    let arr = []
    let flag = 0
    for (let i = 0, len = allFiles.length; i < len; i++) {

        let current = allFiles[i].path.split('/').length

        if (new RegExp(`^${fileTree.path}`).test(allFiles[i].path) && (cascad + 1 === current)) {

            arr.push(allFiles[i])
            flag++

        } else {

            //  匹配成功第一次后面再也没匹配成功过，直接跳出循环
            if ((flag !== 0) && !new RegExp(`^${fileTree.path}`).test(allFiles[i].path)) {
                break
            }
        }

    }
    return arr

}


const oParam = getUrlParam()
const currentPath = getCurrentPath()

/**
 * 递归生成当前文件树下面所有的DOM结构 
 * @param {*当前目录所有的文件} CurrentTreeFiles 
 * @param {*DOM的根节点} parent 
 * @param {*当前层级，点击一下递归再生成两层目录} cascad 
 * @param {*github接口返回的所有文件树} files 
 */

const generateCurrentTreeDOM = function(CurrentTreeFiles, parent, cascad, files) {

    if (!CurrentTreeFiles.length) {
        throw Error('没有相应的文件')
        return
    }

    let count = CurrentTreeFiles[0].path.split('/').length

    CurrentTreeFiles.forEach(ele => {
        let cascading = ele.path.split('/').length

        if (count === cascading) {
            let outerLi = document.createElement('li')
            let iconI = document.createElement('i')
            let hrefA = document.createElement('a')

            /* 设置相对应的图标 */
            setIconCss(ele, iconI)
            hrefA.textContent = ele.path.split('/').pop()
            outerLi.setAttribute('type', ele.type)

            outerLi.appendChild(iconI)
            outerLi.appendChild(hrefA)

            const url = `${oParam.userName}/${oParam.reposName}/${ele.type}/${oParam.branch}`

            hrefA.setAttribute('data-href',
                `${window.location.protocol}//${window.location.host}/${url}/${ele.path}`)

            if (ele.type === 'blob') {
                hrefA.href = `/${url}/${ele.path}`
                hrefA.setAttribute('type', 'blob')
                setClickBlobCss(hrefA)

                if (ele.path.toLocaleLowerCase() === currentPath.toLocaleLowerCase()) {

                    hrefA.setAttribute('isClicked', true)
                    let flag = true // parent => ul

                    if (parent.className !== 'side-bar-main') {
                        parent.parentNode.setAttribute('onoff', 'on')
                        let ele = parent.parentNode //ele => li

                        while (flag) {

                            if (ele.parentNode.className !== 'side-bar-main') {
                                ele.parentNode.parentNode.setAttribute('onoff', 'on')
                            } else {
                                flag = false
                            }
                            ele = ele.parentNode
                        }
                    }

                }

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

                if (ele.path === currentPath) {

                    outerLi.setAttribute('onoff', 'on')
                    hrefA.setAttribute('isClicked', true)
                    let ele = parent // ele => ul
                    let flag = true

                    while (flag) {
                        if (ele.className !== 'side-bar-main') {
                            ele.parentNode.setAttribute('onoff', 'on')
                        } else {
                            flag = false
                        }
                        ele = ele.parentNode.parentNode
                    }

                } else {
                    outerLi.setAttribute('onoff', 'off')
                }

                setClickTreeCss(outerLi, ele, iconI, files)

                let oUl = document.createElement('ul')
                outerLi.appendChild(oUl)

                /* 高效找出当前文件夹所有符合条件的文件 */
                const currentTreeFiles = getCurrentTreeFiles(ele, files, count)

                if (cascad === count) {
                    return
                }
                arguments.callee(currentTreeFiles, oUl, cascad, files)
            }
        }
    })
}


export { getCurrentTreeFiles, generateCurrentTreeDOM, getUrlParam }