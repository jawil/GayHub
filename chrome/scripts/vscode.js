/* let path = chrome.extension.getURL('vs-dev/vs')

require.config({ paths: { 'vs': path } })


let entrance = chrome.extension.getURL('vs-dev/vs/editor/editor.main.js')


document.body.innerHTML = ''


require(['vs/editor/editor.main'], function(ele) {

    console.log(22)

    var editor = monaco.editor.create(document.body, {
        value: [
            'function x() {',
            '\tconsole.log("Hello world!");',
            '}'
        ].join('\n'),
        language: 'javascript'

    });
}) */