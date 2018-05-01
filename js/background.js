/*
 * background.js
 */
var blackPageList = [
  'www.youtube.com',
];                                                     // アクセスしてはいけないurリスト（以下、ブラックリストと呼ぶ。urlの一部でよい）
var openPageInstead = 'https://scholar.google.co.jp/'; // ブラックリストに該当するurlのアクセスが閾値を超えたとき、代わりに開くウェブページ（新規タブを生成）
var blackPageThreshold = 3;                            // ブラックリストに該当するurlのアクセスの閾値
var blackPageCount = 0;                                // ブラックリストに該当するurlのアクセス数
var cheerStrList = [
  '研究頑張ろう！',
  // '書き上げるまで寝るな',
  // 'たまには休憩しよう',
];                                                     // GoogleScholarに表示させるメッセージ
var DEBUG = true;

// スクリプト実行時に呼び出されるメソッド
window.onload = function () {
  // chrome.tabs.onRemoved.addListener(onTabClosed);
};

// content scriptとの通信用のリスナー
chrome.runtime.onMessage.addListener(

  function (request, sender, sendResponse) {
    if (request.message == 'on page loaded') {
      // 新しいページにアクセスしたとき
      this.onPageLoaded(sender.tab);
      sendResponse({ message: sender.tab.url, cheers: cheerStrList });
    } else {
      // 想定されていないメッセージが来たとき
      console.error('\'' + request.message + '\' is undefined request!');
      sendResponse({ message: '', cheers: null });
    }
  }

);

// 新しいページにアクセスしたときに実行するメソッド（必ずしも'新しいTab'というわけではない）
function onPageLoaded(openedTab) {

  if (this.isBlackPage(openedTab)) {
    this.blackPageCount++;
    if (this.blackPageCount >= this.blackPageThreshold) {
      this.onBlackPageFired(openedTab);
    }
  }

  //========= _DEBUG_ 2018.04.29 ==========
  if (DEBUG) {
    console.log(openedTab.url + ' - ' + this.isBlackPage(openedTab) + ' - ' + this.blackPageCount);
  }

}

// ブラックリストに該当するページアクセスが閾値以上に達した時に実行するメソッド
function onBlackPageFired(firedTab) {

  // 発火したタブにアラートを表示
  chrome.tabs.sendMessage(firedTab.id, { message: 'show dialog' }, function (response) {

    if (response.result) {
      // タブのダイアログでの結果がtrueなら、ブラックリストに該当するページを削除し、openPageInsteadを開く
      chrome.tabs.query({}, function (currentTabs) {
        for (var i = 0; i < currentTabs.length; i++) {
          var eachTab = currentTabs[i];
          if (isBlackPage(eachTab)) {
            chrome.tabs.remove(eachTab.id, null);
          }
        }
      });

      chrome.tabs.create({ url: openPageInstead });
      this.initBlackPageCount();

    }
  });

}

// 引数で指定したurlがブラックリストに該当するかどうか調査
function isBlackPage(tab) {

  for (var i = 0; i < this.blackPageList.length; i++) {

    var eachBlackList = this.blackPageList[i];

    if (tab.url.includes(eachBlackList)) {
      return true;
    }
  }

  return false;

}

// 引数で指定した以外のtabで、ブラックリストに該当するタブ数を返す
// function getBlackPagesWithout(withoutTab) {
//   chrome.tabs.query(null, function (currentTabs) {
//     var blackPages = 0;
//     for (var i = 0; i < currentTabs.length; i++) {
//       var eachTab = currentTabs[i];
//       if (eachTab != withoutTab && this.isBlackPage(eachTab)) {
//         blackPages++;
//       }
//     }
//
//     return blackPages;
//   });
// }

// タブが閉じられた時に実行するメソッド 普通にyoutube以外のページに飛んでタブが消されたときに対応していない！
// function onTabClosed(tabId, removeInfo) {
//   chrome.tabs.get(tabId, function (tab) {
//     if (this.isBlackPage(tab) && this.getBlackPagesWithout(tab) <= 0) {
//       this.blackPageCount = 0;
//     }
//   });
// }

function initBlackPageCount() {
  this.blackPageCount = 0;
}
