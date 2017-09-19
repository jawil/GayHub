export function getWindowWidth() {
  return document.documentElement.clientWidth;
}
export function getWindowHeight() {
  return document.documentElement.clientHeight;
}

export function elemOffset(elem) {
  const rect = elem.getBoundingClientRect();
  const docElem = document.documentElement;
  const win = window;
  return {
    top: rect.top + win.pageYOffset - docElem.clientTop,
    left: rect.left + win.pageXOffset - docElem.clientLeft
  };
}

export function once(elem, type, handler) {
  const fn = e => {
    e.target.removeEventListener(type, fn);
    handler();
  };
  elem.addEventListener(type, fn);
}
