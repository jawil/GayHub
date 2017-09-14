// 函数节流防抖
export default function(fn, interval = 250) {
  let timer,
    firstTime = true;
  return function() {
    let args = arguments,
      me = this;
    if (firstTime) {
      fn.apply(me, args);
      return (firstTime = false);
    }
    if (timer) {
      return false;
    }
    timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      fn.apply(me, args);
    }, interval);
  };
}
