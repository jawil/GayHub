/* 生成侧边栏sidebar的HTML */
import { generateContainerHTML } from 'utils/generatePage'
import parentNotRoll from 'libs/parentNotRoll'
import Pjax from 'pjax'
import { toggleBtn, urlChangeEvent } from 'utils/setIconStyle'
import { getUrlParam, initDOM } from 'utils/sideBarHelp'


const sideBarMain = generateContainerHTML()

module.exports = function() {
    const fileWrap = document.querySelectorAll('.file-wrap,.file'),
        allFilesType = []

    if (fileWrap.length) {
        /* 获取参数 */
        const oParam = getUrlParam()

        /* 获取所有的文件名 */
        const filePathName = function(callback) {
            const API = 'https://api.github.com/repos/'
            let parmArr = []
            for (let attr in oParam) {
                parmArr.push(oParam[attr])
            }

            parmArr.splice(2, 1, 'git/trees')

            const getPathUrl = `${API}${parmArr.join('/')}?recursive=1`
            fetch(getPathUrl, {
                method: 'get'
            }).then(response => {
                return response.json()
            }).then(data => {

                callback(data.tree, sideBarMain)

                document.querySelector('#spinner').style.display = 'none'

                new Pjax({
                    elements: "a",
                    selectors: ['#js-repo-pjax-container', '.context-loader-container', '[data-pjax-container]']
                })
                toggleBtn()
                urlChangeEvent(data.tree)
                parentNotRoll('.side-bar-main')

            })
        }(initDOM)

    }
}