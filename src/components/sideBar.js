/* 生成侧边栏sidebar的HTML */
import { generatePath } from 'utils/generatePage'
import parentNotRoll from 'utils/parentNotRoll'
import Pjax from 'pjax'

export default function() {
    const fileWrap = document.querySelectorAll('.file-wrap,.file'),
        allFilesType = []

    if (fileWrap.length) {

        let contentMain = document.querySelector('div[role=main]')
        let react = contentMain.getBoundingClientRect().left

        document.body.style.paddingLeft = Math.max((230 - react), 0) + 'px'

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

                callback(data.tree, document.body, posiUrl, oParam)

                /* 局部刷新页面 */
                new Pjax({
                    elements: "a[type=blob]",
                    selectors: ['#js-repo-pjax-container', '.context-loader-container', '[data-pjax-container]']
                })

                parentNotRoll('.side-bar-main')


            })
        }(generatePath)

    }
}