/* 生成侧边栏sidebar的HTML */
import { generatePath } from 'utils/generatePage'

export default function() {
    const fileWrap = document.querySelectorAll('.file-wrap,.file'),
        allFilesType = []

    if (fileWrap.length) {

        /* 获取参数 */
        const oParam = function() {
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
            oParam.type = parseParam[2] ? `${parseParam[2]}` : 'trees'
            oParam.branch = parseParam[3] ? `${parseParam[3]}` : 'master'
            return oParam
        }()


        /* 获取所有的文件名 */
        const filePathName = function(callback) {
            const API = 'https://api.github.com/repos/'
            let parmArr = []
            for (let attr in oParam) {
                parmArr.push(oParam[attr])
            }
            const posiUrl = `/${parmArr.join('/').replace('trees','blob')}`

            parmArr.splice(2, 1, 'git/trees')

            const getPathUrl = `${API}${parmArr.join('/')}?recursive=1`
            fetch(getPathUrl, {
                method: 'get'
            }).then(response => {
                return response.json()
            }).then(data => {
                callback(data.tree, document.body, posiUrl)

            })
        }(generatePath)



    }
}