$ = function(str) {
    return document.querySelector(str)
}

$$ = Node.prototype.$$ = function(str) {
    return this.querySelectorAll(str)
}

// document instanceof Node => true
// document instanceof HTMLElement => false

export { $, $$ }