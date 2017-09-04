const fileWrap = document.querySelector('.file-wrap')

if (fileWrap) {

    /* 获取参数 */
    const oParam = function() {
        const pathname = window.location.pathname
        const parseParam = pathname.replace(/^\//, '').split('/')
        const oParam = { userName: '', reposName: '', branch: '' }
        oParam.userName = parseParam[0]
        oParam.reposName = parseParam[1]
        oParam.branch = parseParam[3] ? `trees/${parseParam[3]}` : 'trees/master'
        console.log(oParam, 1)
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
        console.log(parmArr.join('/'), 2)
        const getPathUrl = `${API}${parmArr.join('/')}?recursive=1`
        fetch(getPathUrl, {
            method: 'get'
        }).then(response => {
            return response.json()
        }).then(data => {
            callback(data.tree)
            console.log(data)
        })
    }(generatePath)

    /* 组合拼装生成想要的嵌套格式 */
    function generatePath(files) {

        const levalTree1 = []

        files.forEach((ele, index) => {
            let path = ele.path
            let mode = ele.mode

            if (path.split('/').length == 1 && mode == '10644') {
                levalTree1.push(ele.path)
            }

        })

    }





}