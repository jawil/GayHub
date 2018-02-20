/* 收集用户错误信息，及时更正未知bug */
import Raven from "raven-js";
import { $, $$ } from "utils/getDom";

Raven.config(
  "https://fefe8b39c6984f56bcff4562caf28740@sentry.io/214908"
).install();

/* 侧边栏功能 */
const fileWrap = document.$$(".file-wrap,.file");

if (fileWrap.length && !$(".js-code-editor")) {
  let contentMain = $(".repository-content"),
    offsetLeft = contentMain.getBoundingClientRect().left,
    htmlNode = $("html");
  htmlNode.style.marginLeft = `${Math.max(370 - offsetLeft, 0)}px`;

  const sidebarNav = require("components/sidebarNav");
  sidebarNav();
}

/* 回到我的主页 */
/* const overView = require("components/overView");
overView(); */

/* 用户图像 ,GitHub更新已经移除*/
/* if (window.location.pathname === "/") {
  const showAvatar = require("components/showAvatar");
  showAvatar();
  $(".news").addEventListener(
    "click",
    ev => {
      if (ev.target.className !== "ajax-pagination-btn") {
        return;
      }
      let timer = setInterval(f => {
        if (document.$$(".loading").length === 0) {
          clearInterval(timer);
          showAvatar();
          console.info("pagination completed");
        } else {
          console.info("waiting...");
        }
      }, 500);
    },
    false
  );
} */

/* 复制代码 */
const copySnippet = require("components/copySnippet");
copySnippet();

// mouseover只触发一次
const onceMouseover = (function() {
  let count = 0;
  return function() {
    document.body.addEventListener(
      "mouseover",
      e => {
        if (e.target.nodeName !== "PRE") {
          return;
        }
        count++ === 0 && !$(".copy-icon") ? copySnippet() : "";
      },
      false
    );
  };
})();
onceMouseover();

/* TOC展示 */
const webClassContainer = {
  github: [".markdown-body", ".wiki-wrapper"],
  juejin: [".entry-content"]
};
const selectorStr = (function(obj) {
  let selectorArr = [];

  for (let attr in obj) {
    selectorArr = selectorArr.concat(obj[attr]);
  }

  return selectorArr.join(",");
})(webClassContainer);

let container = document.$$(selectorStr)[0];
if (container && container.$$("h1,h2,h3,h4,h5,h6").length) {
  const TOC = require("components/tableOfContent");
}

/* 点击放大图片 */
if (container && container.$$("img").length) {
  const imageZoom = require("components/imageZoom");
  imageZoom(container);
}
