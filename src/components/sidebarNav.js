import { sideBarContainerHTML } from "utils/generatePage";
import { $, $$ } from "utils/getDom";
import { toggleBtn, urlChangeEvent } from "utils/setIconStyle";
import { getUrlParam, initDOM } from "utils/sideBarHelp";
import parentNotRoll from "libs/parentNotRoll";

const sideBarMain = sideBarContainerHTML();
module.exports = function() {
  const fileWrap = document.$$(".file-wrap,.file");

  if (fileWrap.length) {
    /* 获取参数 */
    const oParam = getUrlParam();

    /* 获取所有的文件名 */
    const getFilePathName = (function() {
      const API = "https://api.github.com/repos/";
      let parmArr = [];

      for (let attr in oParam) {
        parmArr.push(oParam[attr]);
      }

      parmArr.splice(2, 1, "git/trees");
      const getPathUrl = `${API}${parmArr.join("/")}?recursive=1`;

      fetch(getPathUrl, {
        method: "get"
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          initDOM(data.tree, sideBarMain);
          toggleBtn();
          urlChangeEvent(data.tree);
          parentNotRoll(".side-bar-main");
          $("#spinner").style.display = "none";
        });
    })();
  }
};
