import Drag from "libs/draggabilly";
import throttle from "libs/throttle";
import parentNotRoll from "libs/parentNotRoll";
import { tableOfContentHTML } from "utils/generatePage";
import { $, $$, attr } from "utils/getDom";
import imagesLoaded from "imagesloaded";
import Eventemitter from "wolfy-eventemitter";

const webClassContainer = {
  github: [".markdown-body", ".wiki-wrapper"],
  juejin: [".entry-content"]
};

const options = {
  title: "h1,h2,h3,h4,h5,h6",
  classWrap: "table-of-content-wrap",
  class: "table-of-content"
};

const styles = {
  childSpan(cascad, flag) {
    return `border-left: 2px solid #563d7c;
                color: #009a61;
                padding-left: calc(${2 + cascad - flag}em - 2px);
                text-decoration: none;
                background-color: #f3f3f3;
                `;
  },

  rootSpan: ` border-left: 3px solid #563d7c;
                color: #009a61;
                padding-left: calc(1em - 3px);
                text-decoration: none;
                background-color: #f3f3f3;
                `,

  childLi: `max-height: 26px;
                transition: all 0.5s ease-out;`,

  rootLi: `max-height: 600px;`
};

const selectorStr = (function(obj) {
  let selectorArr = [];

  for (let attr in obj) {
    selectorArr = selectorArr.concat(obj[attr]);
  }

  return selectorArr.join(",");
})(webClassContainer);

let container = document.$$(selectorStr)[0];

if (container && container.$$(options.title).length) {
  TOC(container);
}

/* github进入issue界面并不会刷新页面，ajax异步局部渲染都存在这个问题 */
const hackGithub = (function() {
  let count = 0;
  document.addEventListener(
    "scroll",
    throttle(e => {
      if (document.$$(selectorStr).length) {
        let innerHTML = container ? container.innerHTML : "";

        if (innerHTML !== document.$$(selectorStr)[0].innerHTML) {
          container = document.$$(selectorStr)[0];

          if ($(`.${options.classWrap}`)) {
            document.body.removeChild($(`.${options.classWrap}`));
          }

          TOC(container);
        }
      } else {
        if ($(`.${options.classWrap}`)) {
          count++ == 1
            ? document.body.removeChild($(`.${options.classWrap}`))
            : "";
        }
      }
    }, 200),
    false
  );
})();

export default function TOC(container) {
  let eventbus = new Eventemitter();

  let current = { index: 0, preIndex: -1, Li: "" },
    isClick = false,
    listHeight = [],
    calculateCurrentIndex,
    titleArr = container.$$(options.title);

  if (!titleArr.length) {
    return;
  }

  let tableOfContent = document.createElement("ul"),
    initScrollHeight =
      titleArr[0].getBoundingClientRect().top -
      $("div").getBoundingClientRect().top -
      200;

  tableOfContent.className = options.class;

  function tableOfContentStart() {
    const titleStr = getTitleStr(titleArr);

    /* 生成TOC的HTML结构 */
    tableOfContentHTML(titleArr, tableOfContent)(titleStr, tableOfContent);

    /* 初始化TOC位置，屏幕不大时候默认是隐藏的*/
    eventbus.emit("toggleTOCBtn");

    if (window.screen.width > 1700) {
      eventbus.emit("toggleTOCBtn");
    }

    /* 计算需要的一些的一些数据 */
    calculateDatas();

    /* 点击TOC目录样式变化 */
    setClickStyle(tableOfContent);

    /* 父集不随子集元素滚动而滚动 */
    parentNotRoll(`.${options.class}`);

    /* 页面内容和TOC目录同步滚动 */
    syncRoll(tableOfContent);

    /* TOC的显示隐藏 */
    let oBtn = $(".table-of-content-btn");
    oBtn.addEventListener(
      "click",
      e => {
        eventbus.emit("toggleTOCBtn");
      },
      false
    );

    new Drag(`.${options.classWrap}`);
  }

  /* 获取页面所有的标题然后拼接成字符串 */
  const getTitleStr = element => {
    let title = [];
    if (element.length) {
      element.forEach(ele => {
        ele.id = ele.textContent;
        title.push(ele.nodeName.toLocaleLowerCase());
      });

      return title.join("");
    }

    return "";
  };

  /* TOC的显示隐藏 */
  eventbus.on("toggleTOCBtn", f => {
    let TOCWrap = $(".table-of-content-wrap");
    let oBtn = $(".table-of-content-btn");

    let right = window.screen.width - TOCWrap.getBoundingClientRect().left;

    let onoff = TOCWrap.attr("toggle") === "on" ? "off" : "on";
    let sideBarWrap = $(".side-bar-wrap");

    if (onoff === "off") {
      TOCWrap.style.cssText = `right:${-right}px;
                               display:block;`;
      oBtn.style.cssText = `left:-${right - 200}px;`;

      if (sideBarWrap && sideBarWrap.attr("toggle") === "off") {
        $("html").style.marginLeft = 0 + "px";
      }
    } else {
      TOCWrap.style.cssText = `right:3%;
                               display:block;`;
      oBtn.style.cssText = `left:10px;`;

      let contentMain = $(".repository-content");
      let react = contentMain.getBoundingClientRect().left;

      if (sideBarWrap && sideBarWrap.attr("toggle") === "off") {
        $("html").style.marginLeft = -Math.max(370 - react, 0) + "px";
      }
    }

    TOCWrap.attr("toggle", onoff);
  });

  /* 页面滚动时候，tableOfContent也跟随者滚动，同步滚动 */
  function syncRoll(element) {
    /* 初始化当前样式，默认是第一个 */
    setRollStyle(element, current.index);

    /* 数据监测 */
    Object.defineProperty(current, "index", {
      set(value) {
        setRollStyle(element, value);
        TOCAutoRollCenter(value);
      }
    });

    /* 函数节流监听滚动事件 */
    document.addEventListener(
      "scroll",
      throttle(e => {
        /* 点击时候也会触发滚动条事件 */
        if (!isClick) {
          calculateCurrentIndex(
            (document.body.scrollTop || document.documentElement.scrollTop) -
              initScrollHeight
          );
        }
        isClick = false;
      }, 200),
      false
    );

    /* TOC出现滚动条时候，激活状态的Tab要一直处于页面中间 */
    function TOCAutoRollCenter(index) {
      let oLi = element.$$("li");
      let currentTop = oLi[index].getBoundingClientRect().top;

      if (tableOfContent.scrollHeight !== tableOfContent.clientHeight) {
        // 此时有滚动条出现
        tableOfContent.scrollTop = currentTop - tableOfContent.clientHeight / 2;
      }
    }
  }

  function setRollStyle(element, index) {
    /* span的个数和li一样多 */
    let oSpan = element.$$("span");
    let Li = element.$$("li");

    /* 点击之后如果是收起菜单栏，那么将移除上面的cssText */
    clearCssText(element);

    /* 重置所有style */
    element.$$("span,li").forEach(ele => {
      if (ele.parentNode.className === options.class) {
        ele.toggle = false;
      }
      ele.style.cssText = "";
    });

    /* 求出LI里面嵌套了几层UL */
    const cascad = getCascad()(oSpan[index]);

    /* 如果是第一层的li，这个才能控制菜单栏的展开与收缩*/
    if (cascad === 1) {
      oSpan[index].parentNode.toggle = !oSpan[index].parentNode.toggle;
    } else {
      let ele = oSpan[index].parentNode, // span标签的父集li
        flag = true;

      while (flag) {
        ele = ele.parentNode.parentNode; // li的父集ul的父集li
        if (ele.parentNode.className === options.class) {
          flag = false;
        }
      }
      ele.toggle = true;
    }

    /* 设置所有嵌套的li样式，递归实现 */
    setActiveStyle()(oSpan[index], cascad);
  }

  /* 点击之后的样式 */
  function setClickStyle(element) {
    /* 点击之后如果是收起菜单栏，那么将移除上面的cssText */
    clearCssText(element);

    element.addEventListener(
      "click",
      e => {
        /* 过滤所有不是span标签的元素 */
        if (e.target.nodeName !== "SPAN") {
          return;
        }

        isClick = true;

        /* 一元运算符+隐式转换 */

        let scrollTop = listHeight[+e.target.attr("index")] + initScrollHeight;
        if (document.body.scrollTop) {
          document.body.scrollTop = scrollTop;
        } else {
          document.documentElement.scrollTop = scrollTop;
        }

        /* 求出LI里面嵌套了几层UL */
        const cascad = getCascad()(e.target);

        /* 如果是第一层的li，这个才能控制菜单栏的展开与收缩*/
        if (cascad === 1) {
          e.target.parentNode.toggle = !e.target.parentNode.toggle;
          current.Li = e.target.parentNode;
        } else {
          let ele = e.target.parentNode, // span标签的父集li
            flag = true;
          while (flag) {
            ele = ele.parentNode.parentNode; // li的父集ul的父集li
            if (ele.parentNode.className === options.class) {
              flag = false;
            }
          }
          ele.toggle = true;
          current.Li = ele;
        }

        /* 重置所有style */
        element.$$("span,li").forEach(ele => {
          if (ele.parentNode.className === options.class) {
            /* 上次点击和这次点击还是同一个目标，就过滤掉 */
            if (
              ele.firstChild.attr("index") !==
              current.Li.firstChild.attr("index")
            ) {
              ele.toggle = false;
              ele.style.cssText = "";
            } else {
              ele.style.cssText = "";
            }
          } else {
            ele.toggle = false;
            ele.style.cssText = "";
          }
        });

        /* 设置所有嵌套的li样式，递归实现 */
        setActiveStyle()(e.target, cascad);
      },
      false
    );
  }

  /* 点击之后如果是收起菜单栏，那么将移除上面的cssText */
  function clearCssText(element) {
    Array.prototype.slice.call(element.children).forEach(item => {
      item.toggle = false;
      item.addEventListener(
        "mouseleave",
        e => {
          // 防止冒泡
          if (item.toggle === false) {
            e.target.style.cssText = "";
          }
        },
        false
      );
    });
  }

  /* 求出LI里面嵌套了几层UL */
  function getCascad() {
    let count = 0;
    return function(element) {
      count++;
      if (element.parentNode.parentNode.className === options.class) {
        return count;
      } else {
        arguments.callee(element.parentNode.parentNode.parentNode.firstChild);
      }
      return count;
    };
  }

  /* 设置所有嵌套的li样式，递归实现 */
  function setActiveStyle() {
    let flag = 0;
    return function(element, cascad) {
      let cascadIndex = cascad;
      flag++;
      // 容器第一层的Li
      if (element.parentNode.parentNode.className === options.class) {
        /* 设置span标签父集li的样式 */
        element.parentNode.style.cssText = element.parentNode.toggle
          ? styles.rootLi
          : styles.childLi;

        /* 设置span标签样式 */
        element.style.cssText = styles.rootSpan;
        return;
      } else {
        /* 设置span标签父集li的样式 */
        element.parentNode.style.cssText = styles.rootLi;

        /* 设置span标签样式 */
        element.style.cssText = styles.childSpan(cascad, flag);

        arguments.callee(
          element.parentNode.parentNode.parentNode.firstChild,
          cascadIndex
        );
      }
    };
  }

  function calculateDatas() {
    /* 把两个标题之间的内容长度算出来 */
    const calculateHeight = f => {
      let listHeight = [];
      let height = 0;
      let oldReactTop = titleArr[0].getBoundingClientRect().top;

      titleArr.forEach(ele => {
        let react = ele.getBoundingClientRect();
        height += react.top - oldReactTop;
        oldReactTop = react.top;
        listHeight.push(height);
      });

      return listHeight;
    };

    listHeight = calculateHeight();

    /* 计算当前滚动内容可视区域的index */
    calculateCurrentIndex = scrollY => {
      for (let i = 0; i < listHeight.length; i++) {
        let preHeight = listHeight[i];
        let nextHeight = listHeight[i + 1];

        if (scrollY < listHeight[0]) {
          current.index = 0;
          return;
        }

        if (!nextHeight || (scrollY >= preHeight && scrollY < nextHeight)) {
          /* 微微提高性能，只有当index改变时候才去监听，然后调用函数 */
          if (i !== current.preIndex) {
            current.index = i;
            current.preIndex = i;
          }
          return;
        }
      }
    };

    /* 初始化样式 */
    calculateCurrentIndex(
      document.body.scrollTop || document.documentElement.scrollTop
    );
  }

  /* 等图片全部加载完成再加载TOC，防止图片未加载完成造成内容坍塌 */
  imagesLoaded(container, { background: true }, function() {
    /* 如果当前滚动条超过页面一半，显示TOC目录导航 */
    tableOfContentStart();
  });
}
