import { $, attr } from "utils/getDom";
module.exports = function() {
  const logoAvatar = $(".header-logo-invertocat"),
    userAvatarEle = $(".avatar"),
    isLogined = $(".text-bold");

  let overViewUrl;

  if (isLogined && isLogined.textConten === "Sign in") {
    overViewUrl = `https://github.com`;
  } else {
    const userName = userAvatarEle.attr("alt").slice(1);
    overViewUrl = `https://github.com/${userName}`;
  }

  let overViewHTML = `
    <a class="header-logo-invertocat HeaderNavlink" href=${overViewUrl}  aria-label="Homepage" style="line-height:32px;">
    Overview
    </a>`;

  logoAvatar.parentNode.innerHTML += overViewHTML;
};
