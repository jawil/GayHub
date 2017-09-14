console.log(11111);

var monaco = require("../package/dev/vs/loader.js");

let path = chrome.extension.getURL("package/dev/vs");

monaco.config({ paths: { vs: path } });

let entrance = chrome.extension.getURL("package/dev/vs/editor/editor.main.js");

console.log(11111, entrance);

document.querySelector(".js-file-line-container").innerHTML = "str";

monaco(["vs/editor/editor.main"], function(ele) {
  console.log(22);
  console.log(monaco, 33333);

  var editor = monaco.editor.create(
    document.querySelector(".js-file-line-container"),
    {
      value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join(
        "\n"
      ),
      language: "javascript"
    }
  );
});
