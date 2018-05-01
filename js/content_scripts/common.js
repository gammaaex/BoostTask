/*
 * common.js
 */

var lastUrl = '';     // 更新前のURL
var cheerStrList = [];
var fontLink = 'https://fonts.googleapis.com/earlyaccess/roundedmplus1c.css';

// ページをロードした時に呼ばれるメソッド
window.onload = function () {

  init();
  updateLastUrl(location.href);
  onNewPageLoaded(function (message) {
    cheerStrList = message.cheers;
    individualOnLoad(location.href);
  });

};

// backgroundページとの通信用リスナー
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

  if (request.message == 'show dialog') {
    sendResponse({ result: showDialog() });
  } else {
    sender.console.error('\'' + request.message + '\' is undefined request!');
    sendResponse({ result: false });
  }

});

// 初期化
function init() {

  var body = document.body;

  if (body.addEventListener) {
    body.addEventListener('click', onMouseClick);
  } else {
    alert('adding event listenerに対応していません');
  }

}

// ページ別の処理
function individualOnLoad(url) {
  if (url.includes('scholar.google')) {
    var googleFontLink = document.createElement('link');
    var messageDiv = document.createElement('div');
    var mainLogo = document.getElementById('gs_hdr_hp_lgow');
    var documentHead = document.head;
    googleFontLink.setAttribute('href', fontLink);
    googleFontLink.setAttribute('rel', 'stylesheet');
    documentHead.appendChild(googleFontLink);
    messageDiv.textContent = cheerStrList[getRandomInt(cheerStrList.length)];
    messageDiv.id = 'cheer';
    mainLogo.insertBefore(messageDiv, mainLogo.firstChild);
  }
}

// ダイアログを表示し、ユーザの意思を真偽値で返すメソッド
function showDialog() {
  return window.confirm('研究に戻りなさい！\n研究に戻りますか？');
}

function onMouseClick() {

  if (!isEqualsLastUrl(location.href)) {
    onNewPageLoaded({});
    updateLastUrl(location.href);
  }

}

// ページをロードしたことをbackgroundに通知する
function onNewPageLoaded(callBack) {
  chrome.runtime.sendMessage({ message: 'on page loaded' }, callBack);
}

function updateLastUrl(url) {
  lastUrl = url;
}

function isEqualsLastUrl(url) {
  return lastUrl == url;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
