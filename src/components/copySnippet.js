import Clipboard from "clipboard";
import { $, $$ } from "utils/getDom";
module.exports = function copySnippet() {
  let copySnippets = document.$$("pre:not(.CodeMirror-line)");

  if (copySnippets.length) {
    // 插入表示复制的icon标签
    copySnippets.forEach(ele => {
      let parent = ele.parentNode,
        copyWrap = document.createElement("div"),
        copyIcon = document.createElement("img"),
        copyTips = document.createElement("span");

      parent.replaceChild(copyWrap, ele);
      copyWrap.appendChild(ele);

      copyIcon.className = "copy-icon";
      copyWrap.className = "copy-wrap";
      copyTips.className = "copy-tips";
      copyTips.textContent = "复制到剪切板";

      // 如果用链接的话，github设置的CSP安全机制会报错，所以这里图标用base64或者svg
      copyIcon.src = chrome.extension.getURL("icons/copy.png");

      copyWrap.appendChild(copyIcon);
      copyWrap.appendChild(copyTips);
    });

    const clipboard = new Clipboard(".copy-icon", {
      target: trigger => {
        return trigger.parentNode.querySelector("pre");
      }
    });

    clipboard.on("success", e => {
      e.trigger.parentNode.lastChild.textContent = "已复制到剪切板";
      e.trigger.parentNode.style.cssText = "display:block";
      e.clearSelection();
    });

    // 事件委托
    document.body.addEventListener(
      "click",
      e => {
        if (e.target.className !== "copy-icon") {
          return;
        }
        e.preventDefault();
      },
      false
    );

    document.body.addEventListener(
      "mouseout",
      e => {
        if (e.target.className !== "copy-icon") {
          return;
        }
        e.target.parentNode.lastChild.textContent = "复制到剪切板";
        e.preventDefault();
      },
      false
    );
  }
};
