/* 让子元素scroll父元素容器不跟随滚动 */
export default function($id) {
  var flag; //标记滚动方向，true-向下，false-向上
  var $test = document.querySelector($id);
  var eventType = "mousewheel";

  // 火狐是DOMMouseScroll事件
  if (document.mozHidden !== undefined) {
    eventType = "DOMMouseScroll";
  }
  myAddEvent($test, eventType, getData);

  function getData(event) {
    var e = event || window.event;
    var scrollHeight = $test.scrollHeight, //元素的全部高度，包括滚动条高度
      height = $test.clientHeight, //元素设置的高度
      maxHeight = scrollHeight - height, //滚动条可以滚动最大高度
      scrollTop = $test.scrollTop; //滚动条的高度
    var delta = e.wheelDelta ? e.wheelDelta : e.detail;
    if (delta < -3 || delta == 3) {
      flag = true;
    } else if (delta > 3 || delta == -3) {
      flag = false;
    }
    //判断当滚动向下，并且滚动到边界，就阻止浏览器默认行为，否则就取消阻止默认行为
    if ((flag && scrollTop >= maxHeight) || (!flag && scrollTop <= 0)) {
      stopDefault();
    }
  }

  //兼容绑定事件方法
  function myAddEvent(ele, sEvent, getData) {
    if (ele.addEventListener && !ele.attachEvent) {
      //非IE
      ele.addEventListener(sEvent, getData);
    } else {
      //IE
      if (document.attachEvent && !document.addEventListener) {
        //IE8以
        ele.attachEvent("on" + sEvent, getData);
      } else {
        //IE8以上
        ele.addEventListener(sEvent, getData);
      }
    }
  }

  //阻止默认浏览器动作
  function stopDefault() {
    var e = arguments.callee.caller.arguments[0] || window.event;
    if (e.preventDefault) {
      //非IE
      e.preventDefault();
      //IE中阻止函数器默认动作的方式
    } else {
      //IE
      e.returnValue = false;
    }
    return false;
  }
}
