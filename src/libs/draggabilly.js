// 这是一个私有属性，不需要被实例访问
var transform = getTransform();

export default function Drag(selector) {
    // 放在构造函数中的属性，都是属于每一个实例单独拥有
    this.elem = typeof selector == 'Object' ? selector : document.querySelector(selector);
    this.startX = 0;
    this.startY = 0;
    this.sourceX = 0;
    this.sourceY = 0;

    this.init();
}


// 原型
Drag.prototype = {
    constructor: Drag,

    init: function() {
        // 初始时需要做些什么事情
        this.setDrag();
    },

    // 稍作改造，仅用于获取当前元素的属性，类似于getName
    getStyle: function(property) {
        return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(this.elem, false)[property] : this.elem.currentStyle[property];
    },

    // 用来获取当前元素的位置信息，注意与之前的不同之处
    getPosition: function() {
        var pos = { x: 0, y: 0 };
        if (transform) {
            var transformValue = this.getStyle(transform);
            if (transformValue == 'none') {
                this.elem.style[transform] = 'translate(0, 0)';
            } else {
                var temp = transformValue.match(/-?\d+/g);
                pos = {
                    x: parseInt(temp[4].trim()),
                    y: parseInt(temp[5].trim())
                }
            }
        } else {
            if (this.getStyle('position') == 'static') {
                this.elem.style.position = 'relative';
            } else {
                pos = {
                    x: parseInt(this.getStyle('left') ? this.getStyle('left') : 0),
                    y: parseInt(this.getStyle('top') ? this.getStyle('top') : 0)
                }
            }
        }

        return pos;
    },

    // 用来设置当前元素的位置
    setPostion: function(pos) {
        if (transform) {
            this.elem.style[transform] = 'translate(' + pos.x + 'px, ' + pos.y + 'px)';
        } else {
            this.elem.style.left = pos.x + 'px';
            this.elem.style.top = pos.y + 'px';
        }
    },

    // 该方法用来绑定事件
    setDrag: function() {
        var self = this;
        this.elem.addEventListener('mousedown', start, false);

        function start(event) {
            self.startX = event.pageX;
            self.startY = event.pageY;

            var pos = self.getPosition();

            self.sourceX = pos.x;
            self.sourceY = pos.y;

            document.addEventListener('mousemove', move, false);
            document.addEventListener('mouseup', end, false);
        }

        function move(event) {
            var currentX = event.pageX;
            var currentY = event.pageY;

            var distanceX = currentX - self.startX;
            var distanceY = currentY - self.startY;

            self.setPostion({
                x: (self.sourceX + distanceX).toFixed(),
                y: (self.sourceY + distanceY).toFixed()
            })
        }

        function end(event) {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', end);
            // do other things
        }
    }
}

// 私有方法，仅仅用来获取transform的兼容写法
function getTransform() {
    var transform = '',
        divStyle = document.createElement('div').style,
        transformArr = ['transform', 'webkitTransform', 'MozTransform', 'msTransform', 'OTransform'],

        i = 0,
        len = transformArr.length;

    for (; i < len; i++) {
        if (transformArr[i] in divStyle) {
            return transform = transformArr[i];
        }
    }

    return transform;
}