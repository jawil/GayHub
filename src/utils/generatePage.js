import { getUrlParam } from "utils/sideBarHelp";
import { $, $$, attr } from "utils/getDom";

/* 生成侧边栏sidebar的HTML */
function sideBarContainerHTML() {
  const oParam = getUrlParam(),
    sideBarMainHTML = `<ul class="side-bar-main"></ul>`,
    toggleBtnHTML = `<a class="toggle-btn"></a>`,
    sideBarHeaderHTML = `
    <div class="side-bar-header">
    <div class="side-bar-header-repo">
        <a href="/${oParam.userName}">${oParam.userName}</a>/
        <a type="blob" href="/${oParam.userName}/${oParam.reposName}">${oParam.reposName}</a>
    </div>
    <div class="side-bar-header-branch">${decodeURIComponent(
      oParam.branch
    )}</div>
    <div id="spinner">
        <div class="spinner-container container1">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
        </div>
        <div class="spinner-container container2">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
        </div>
        <div class="spinner-container container3">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
        </div>
    </div>
</div>`,
    sideBarWrapHTML = `<div class="side-bar-wrap">
                            ${sideBarHeaderHTML}
                            ${toggleBtnHTML}
                            ${sideBarMainHTML}
                         </div>`;

  document.body.innerHTML += sideBarWrapHTML;

  $(".side-bar-wrap").attr("toggle", "on");

  return $(".side-bar-main");
}

/* 生成tableOfContent的HTML */
function tableOfContentHTML(titleArr, root) {
  let count = 0;

  const tableOfContentWrap = document.createElement("div"),
    headerHTML = `<div class="table-of-content-header">
                        Table of Content
                        <a href="https://github.com/jawil" 
                        class="table-of-content-auth" target="_blank">
                        by jawil
                    </a>
                     </div>`,
    toggleBtnHTML = `<a class="table-of-content-btn"></a>`,
    containerHTML = `<div class="table-of-content-wrap" toggle="on">
                        ${toggleBtnHTML}
                        ${headerHTML}
                    </div>`;

  tableOfContentWrap.className = "table-of-content-wrap";
  tableOfContentWrap.attr("toggle", "on");

  tableOfContentWrap.innerHTML = `${toggleBtnHTML}${headerHTML}`;
  tableOfContentWrap.appendChild(root);
  document.body.appendChild(tableOfContentWrap);

  return function(str, parent) {
    let h = str[1] - 1,
      reg = [
        /h1.*?(?=(h1)|\b)/g,
        /h2.*?(?=(h2)|\b)/g,
        /h3.*?(?=(h3)|\b)/g,
        /h4.*?(?=(h4)|\b)/g,
        /h5.*?(?=(h5)|\b)/g,
        /h6.*?(?=(h6)|\b)/g
      ][h];

    let titleGroup = str.match(reg);

    titleGroup.forEach(item => {
      let outLi = document.createElement("li");
      let oSpan = document.createElement("span");

      oSpan.textContent = titleArr[count].textContent;
      oSpan.attr("index", count);

      outLi.appendChild(oSpan);
      count++;
      parent.appendChild(outLi);
      let ele = item.substr(2);

      if (ele.length === 0) {
        return;
      } else {
        let oUl = document.createElement("ul");
        let oLi = document.createElement("li");
        outLi.appendChild(oUl);
        parent.appendChild(outLi);
        arguments.callee(ele, oUl, root);
      }
    });
  };
}

export { sideBarContainerHTML, tableOfContentHTML };
