/*
 * popup.js
 */

var backgroundInstance;

window.onload = function () {
  init();
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
