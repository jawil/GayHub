import { zoom } from "../zoom/zoom"

module.exports = function(container) {

    const zoomImageArr = container.querySelectorAll('img')

    zoomImageArr.forEach(ele => {

        if (ele.parentNode.nodeName === 'A') {
            ele.parentNode.parentNode.replaceChild(ele, ele.parentNode)
        }
        
        ele.setAttribute('data-action', 'zoom')
        zoom.setup(ele)
    })
}