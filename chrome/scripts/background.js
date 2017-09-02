'use strict';

chrome.runtime.onInstalled.addListener(function(details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function(tabId) {
    chrome.pageAction.show(tabId);
    
   /*  chrome.tabs.executeScript(tabId, {
        "file": "package/min/vs/editor/editor.main.js"
    }, null); */

});

