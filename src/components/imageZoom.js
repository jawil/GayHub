import { zoom } from "../zoom/zoom"
import { $, $$ } from 'utils/getDom'

module.exports = function(container) {

    const zoomImageArr = container.$$('img')

    zoomImageArr.forEach(ele => {

        if (ele.parentNode.nodeName === 'A') {

            if (/https:\/\/camo\.githubusercontent\.com/.test(ele.parentNode.href)) {

                ele.parentNode.parentNode.replaceChild(ele, ele.parentNode)
                ele.setAttribute('data-action', 'zoom')
                zoom.setup(ele)

            }

        }


    })
}