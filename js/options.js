window.onload = function () {
    initializeListeners();
};

// Saves options to chrome.storage
function save_options() {
    var form = document.getElementsByClassName('form-control');
    var urlList = [];

    for (var item of form) {
        urlList.push(item.value);
    }

    chrome.storage.sync.set({
        urlList: urlList,
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get("urlList", function (items) {
        console.log(items);
    });
}

function initializeListeners() {
    document.addEventListener('DOMContentLoaded', this.restore_options);
    document.getElementById('save').addEventListener('click', this.save_options);
    document.getElementById('restore').addEventListener('click', this.restore_options);
}

$(document).ready(function () {
    $("#addBtn").click(function () {
        $("#list").append($('<li><div class="input-group"><input class="form-control"value="http://example.com/"/><div class="input-group-btn"><button class="delbtn btn btn-danger">削除</button></div></div></li>'))
    });
    $("#list").on("click", ".delbtn", function () {
        $(this).parents('li').remove();
    })
});
