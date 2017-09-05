const fileWrap = document.querySelector('.file-wrap')

if (fileWrap) {

    /* 获取参数 */
    const oParam = function() {
        const pathname = window.location.pathname
        const parseParam = pathname.replace(/^\//, '').split('/')
        const oParam = {
            userName: '',
            reposName: '',
            branch: ''
        }
        oParam.userName = parseParam[0]
        oParam.reposName = parseParam[1]
        oParam.branch = parseParam[3] ? `trees/${parseParam[3]}` : 'trees/master'
        return oParam
    }()

    /* 获取所有的文件名 */
    const filePathName = function(callback) {
        const API = 'https://api.github.com/repos/'
        let parmArr = []
        for (let attr in oParam) {
            parmArr.push(oParam[attr])
        }
        parmArr.splice(2, 0, 'git')
        const getPathUrl = `${API}${parmArr.join('/')}?recursive=1`
        fetch(getPathUrl, {
            method: 'get'
        }).then(response => {
            return response.json()
        }).then(data => {
            callback(data.tree, document.body)
        })
    }(generatePath)


    /* 组合拼装生成想要的嵌套格式 */
    function generatePath(files, parent) {

        let sideBarWrap = document.createElement('ul')
        sideBarWrap.className = 'side-bar-wrap'
        parent.appendChild(sideBarWrap)

        /* 默认从第1级目录开始 */
        ! function(currentFiles, parent) {
            let count = currentFiles[0].path.split('/').length

            currentFiles.forEach(ele => {
                let cascading = ele.path.split('/').length
                let outerLi = document.createElement('li')
                if (count === cascading) {

                    outerLi.textContent = ele.path
                    parent.appendChild(outerLi)

                    /* 求出tree文件下所有的文件 */
                    if (ele.type == 'tree') {

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





}