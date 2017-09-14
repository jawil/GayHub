import {
  setIconCss,
  setClickTreeCss,
  setClickBlobCss
} from "utils/setIconStyle";

import { $, $$, attr } from "utils/getDom";

import Pjax from "pjax";

/* 根据浏览器的url解析参数 */
const getUrlParam = function() {
  const pathname = window.location.pathname;
  const parseParam = pathname.replace(/^\//, "").split("/");

  const oParam = {
    userName: "",
    reposName: "",
    type: "",
    branch: ""
  };
  oParam.userName = parseParam[0];
  oParam.reposName = parseParam[1];
  oParam.type = parseParam[2] ? `${parseParam[2]}` : "tree";
  let branchWrap = $("span.css-truncate-target");
  oParam.branch = branchWrap ? branchWrap.textContent : "master";

  return oParam;
};

/* 获取当前的文件名称 */
const getCurrentPath = function() {
  const pathname = window.location.pathname,
    branchWrap = $("span.css-truncate-target"),
    branch = branchWrap ? branchWrap.textContent : "master",
    currentPath = pathname.split(`${branch}/`).pop();
  return currentPath;
};

/**
 * 高效找出当前文件夹所有符合条件的文件
 * @param {type:Object} fileTree 
 * @param {type:Array} allFiles 
 * @param {type:Number} cascad 
 */
const getCurrentTreeFiles = function(fileTree, allFiles, cascad) {
  let arr = [];
  let flag = 0;
  const path = fileTree.path
    .replace(/(?!\\)\+/g, "\\+")
    .replace(/(?!\\)\./g, "\\.")
    .replace(/(?!\\)\?/g, "\\?");

  for (let i = 0, len = allFiles.length; i < len; i++) {
    let current = allFiles[i].path.split("/").length;

    if (
      new RegExp(`^${path}`).test(allFiles[i].path) &&
      fileTree.path.split("/").shift() ===
        allFiles[i].path.split("/").shift() &&
      cascad + 1 === current
    ) {
      arr.push(allFiles[i]);
      flag++;
    } else {
      //  匹配成功第一次后面再也没匹配成功过，直接跳出循环
      if (flag !== 0 && !new RegExp(`^${path}`).test(allFiles[i].path)) {
        break;
      }
    }
  }
  return arr;
};

const oParam = getUrlParam();
const currentPath = getCurrentPath();

/* 解析首次打开url要解析的DOM结构 */
const initDOM = function(files, parent) {
  generateCurrentTreeDOM(files, parent, 2, files);

  /* 重新渲染Pjax */
  new Pjax({
    elements: "a[data-href],a[id],a[type],span.js-path-segment>a",
    selectors: [
      "#js-repo-pjax-container",
      ".context-loader-container",
      "[data-pjax-container]"
    ]
  });

  document.addEventListener("pjax:send", function() {
    $("#spinner").style.display = "block";
  });

  document.addEventListener("pjax:success", function() {
    $("#spinner").style.display = "none";
  });

  let flag = 1;
  while (flag) {
    let topElePath = currentPath
      .split("/")
      .slice(0, flag)
      .join("/");
    const topLi = $(`li[path="${topElePath}"]`);

    if (topLi) {
      topLi.attr("onoff", "on");
      const ele = { path: topLi.attr("path") };
      RenderDOM(topLi, ele, files);

      if (flag === currentPath.split("/").length) {
        flag = false;
        return;
      }
      flag++;
    } else {
      let lastA = $(`a[data-href="${window.location.href}"]`);

      if (lastA) {
        let react = lastA.parentNode.getBoundingClientRect().top;
        let container = $(".side-bar-main");
        container.scrollTop = react - container.clientHeight / 2;
        lastA.attr("isClicked", true);
      }

      return;
    }
  }
};

/* 点击之后重新生成渲染DOM */
const RenderDOM = function(eleLi, ele, files) {
  let currentCascad = ele.path.split("/").length;

  /* 当前目录下的所有文件 */
  let currentTreeFiles = getCurrentTreeFiles(ele, files, currentCascad);

  let currenteleLiChild = eleLi.$$("li");

  /* 求出当前目录下所有的文件夹DOM节点，也就是type=tree */
  let treeChild = [];

  if (currenteleLiChild.length) {
    currenteleLiChild.forEach(ele => {
      if (ele.attr("type") === "tree") {
        treeChild.push(ele);
      }
    });
  }

  /* 求出当前所有文件树的状态信息，也就是type=tree */
  let treeMsg = [];

  currentTreeFiles.forEach(ele => {
    if (ele.type === "tree") {
      treeMsg.push(ele);
    }
  });

  /* 如果当前目录下的所有文件并没有文件夹类型 */
  if (treeChild.length && eleLi.attr("generateDOM") !== "off") {
    treeChild.forEach((ele, index) => {
      let nextCascad = treeMsg[index].path.split("/").length;
      let nextTreeFiles = getCurrentTreeFiles(
        treeMsg[index],
        files,
        nextCascad
      );

      /* 如果不是空文件夹 */
      if (nextTreeFiles.length) {
        generateCurrentTreeDOM(nextTreeFiles, ele, nextCascad + 1, files);
      }
    });
  }
  /* 重新渲染Pjax */
  new Pjax({
    elements: "a[data-href],a[id],a[type],span.js-path-segment>a",
    selectors: [
      "#js-repo-pjax-container",
      ".context-loader-container",
      "[data-pjax-container]"
    ]
  });

  /* 设置开关，防止重复渲染，影响性能 */
  eleLi.attr("generateDOM", "off");
};

/**
 * 递归生成当前文件树下面所有的DOM结构 
 * @param {*当前目录所有的文件} CurrentTreeFiles 
 * @param {*DOM的根节点} parent 
 * @param {*当前层级，点击一下递归再生成两层目录} cascad 
 * @param {*github接口返回的所有文件树} files 
 */

const generateCurrentTreeDOM = function(
  CurrentTreeFiles,
  parent,
  cascad,
  files
) {
  if (!CurrentTreeFiles.length) {
    return;
  }

  /* 重新渲染Pjax */
  new Pjax({
    elements: "a[data-href],a[id],a[type],span.js-path-segment>a",
    selectors: [
      "#js-repo-pjax-container",
      ".context-loader-container",
      "[data-pjax-container]"
    ]
  });

  let count = CurrentTreeFiles[0].path.split("/").length;

  CurrentTreeFiles.forEach(ele => {
    let cascading = ele.path.split("/").length;

    if (count === cascading) {
      let outerLi = document.createElement("li");
      let iconI = document.createElement("i");
      let hrefA = document.createElement("a");

      /* 设置相对应的图标 */
      setIconCss(ele, iconI);
      hrefA.textContent = ele.path.split("/").pop();
      outerLi.attr("type", ele.type);

      outerLi.appendChild(iconI);
      outerLi.appendChild(hrefA);

      if (ele.type === "tree") {
        outerLi.attr("path", ele.path);
      }

      const url = `${oParam.userName}/${oParam.reposName}/${ele.type}/${oParam.branch}`;

      hrefA.attr(
        "data-href",
        `${window.location.protocol}//${window.location
          .host}/${url}/${ele.path}`
      );

      if (ele.type === "blob") {
        hrefA.href = `/${url}/${ele.path}`;
        hrefA.attr("type", "blob");
        setClickBlobCss(hrefA);

        parent.appendChild(outerLi);
      } else {
        const firstBlobChild = (function() {
          const childrenArr = Array.from(parent.children);
          for (let eleLi of childrenArr) {
            if (eleLi.attr("type") === "blob") {
              return eleLi;
            }
          }
          return null;
        })();
        parent.insertBefore(outerLi, firstBlobChild);
      }

      /* 求出tree文件下所有的文件 */
      if (ele.type == "tree") {
        let oSpan = document.createElement("span");
        outerLi.insertBefore(oSpan, iconI);

        /* 默认文件夹都是收缩的 */
        if (ele.path === currentPath) {
          outerLi.attr("onoff", "on");
          hrefA.attr("isClicked", true);
          let ele = parent; // ele => ul

          ele.parentNode.attr("onoff", "on");
        } else {
          outerLi.attr("onoff", "off");
        }

        setClickTreeCss(outerLi, ele, iconI, files);

        let oUl = document.createElement("ul");
        outerLi.appendChild(oUl);

        /* 高效找出当前文件夹所有符合条件的文件 */
        const currentTreeFiles = getCurrentTreeFiles(ele, files, count);

        if (cascad === count) {
          return;
        }
        arguments.callee(currentTreeFiles, oUl, cascad, files);
      }
    }
  });
};

export {
  initDOM,
  getCurrentTreeFiles,
  generateCurrentTreeDOM,
  RenderDOM,
  getUrlParam,
  getCurrentPath
};
