module.exports = function() {

    const logoAvatar = document.querySelector('.header-logo-invertocat'),
        userAvatarEle = document.querySelector('.avatar'),
        isLogined = document.querySelector('.text-bold')

    let overViewUrl

    if (isLogined && isLogined.textConten === 'Sign in') {
        overViewUrl = `https://github.com`
    } else {
        const userName = userAvatarEle.getAttribute('alt').slice(1)
        overViewUrl = `https://github.com/${userName}`
    }

    let overViewHTML = `
    <a class="header-logo-invertocat HeaderNavlink" href=${overViewUrl}  aria-label="Homepage" style="line-height:32px;">
    Overview
    </a>`

    logoAvatar.parentNode.innerHTML += overViewHTML
}