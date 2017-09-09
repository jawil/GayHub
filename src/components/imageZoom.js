import { zoom } from "../zoom/zoom"

module.exports = function(container) {

    const zoomImageArr = container.querySelectorAll('img')

    zoomImageArr.forEach(ele => {

        let typeName = ele.href.split('.').pop()
        let imgArr = ['png', 'jpg', 'jpeg', 'svg', 'gif']

        if (ele.parentNode.nodeName === 'A' && (typeName.indexOf(imgArr) !== -1)) {
            ele.parentNode.parentNode.replaceChild(ele, ele.parentNode)
        }

        ele.setAttribute('data-action', 'zoom')
        zoom.setup(ele)
    })
}