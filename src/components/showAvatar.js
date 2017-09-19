import { $, $$ } from "utils/getDom";
module.exports = function showAvatar() {
  let index = 0,
    userArr = [],
    userAvatar = {},
    element = document.$$(".title"),
    filterEle = Array.from(element).filter((ele, current) => {
      return (
        /\b(starred|forked|created|added)\b/g.test(ele.textContent) &&
        current >= index
      );
    });

  index += filterEle.length;

  // 获得用户图像
  function getUserImg(callback) {
    filterEle.forEach(ele => {
      let userName = ele.textContent.match(/\S.*?\s/)[0].replace(/\s+/g, "");
      userArr.push(userName);
    });
    let uniqueUser = [...new Set(userArr)];
    fetch(generateUrl(uniqueUser, 50), {
      method: "get"
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        data.items.forEach(ele => {
          userAvatar[ele.login] = ele.avatar_url;
        });
        callback(userAvatar);
      });
  }

  // 构造请求URL
  function generateUrl(array, pagination) {
    array.forEach((ele, i, array) => {
      array[i] = `user%3A${array[i]}`;
    });
    return `//api.github.com/search/users?q=${array.join("+")}${pagination
      ? "&per_page=" + pagination
      : ""}`;
  }

  // 把图像填充到页面上去
  getUserImg(userAvatar => {
    filterEle.forEach(ele => {
      let userName = ele.textContent.match(/\S.*?\s/)[0].replace(/\s+/g, "");
      let oImg = document.createElement("img");
      let reforeNode = ele.children[0];
      oImg.className = "github-avatar";
      oImg.src = userAvatar[userName];
      ele.insertBefore(oImg, reforeNode);
    });
  });
};
