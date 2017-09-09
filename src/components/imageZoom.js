import { zoom } from "../zoom/zoom"

module.exports = function(container) {

    const zoomImageArr = container.querySelectorAll('img')

    zoomImageArr.forEach(ele => {



        let imgArr = ['png', 'jpg', 'jpeg', 'svg', 'gif']

        if (ele.parentNode.nodeName === 'A') {

            if (/https:\/\/camo\.githubusercontent\.com/.test(ele.parentNode.href)) {
                
                ele.parentNode.parentNode.replaceChild(ele, ele.parentNode)
                ele.setAttribute('data-action', 'zoom')
                zoom.setup(ele)
                
            }

        }


    })
}