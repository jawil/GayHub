const $ = function(str) {
  return document.querySelector(str);
};

const $$ = (Node.prototype.$$ = function(str) {
  return this.querySelectorAll(str);
});

const attr = (HTMLElement.prototype.attr = function(attr, value) {
  return arguments[1] == void 0
    ? this.getAttribute(attr)
    : this.setAttribute(attr, value);
});

// document instanceof Node => true
// document instanceof HTMLElement => false

export { $, $$, attr };
