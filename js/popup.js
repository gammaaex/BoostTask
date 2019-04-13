/*
 * popup.js
 */

var backgroundInstance;

window.onload = function () {
    init();
    initializeListeners();
};

function init() {
    this.backgroundInstance = chrome.extension.getBackgroundPage();
}

function log(message) {
    this.backgroundInstance.console.log(message);
}

function logError(message) {
    this.backgroundInstance.console.log(message);
}

function initializeListeners() {
    document.querySelector('#go-to-options').addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('../html/options.html'));
        }
    });
}
