(function() {
    "use strict";

    function updateProgress(event) {
        var record = event.record;
        var table = record.チェック項目一覧.value; // テーブルデータ

        if (table.length === 0) {
            record.進捗.value = "未着手"; // テーブルが空なら未着手
            return event;
        }

        // "チェック" フィールドにチェックが入っている行の数をカウント
        var checkedCount = table.filter(row => row.value.チェック.value.includes("済")).length; 
        var totalCount = table.length; // テーブルの行数

        if (checkedCount === 0) {
            record.進捗.value = "未着手"; // 1つもチェックされていない
        } else if (checkedCount === totalCount) {
            record.進捗.value = "完了"; // すべての行にチェックが入っている
        } else {
            record.進捗.value = "実施中"; // 一部の行だけチェックされている
        }

        return event;
    }

    // チェックボックスの変更時に進捗を更新
    kintone.events.on(["app.record.edit.change.チェック項目一覧", "app.record.create.change.チェック項目一覧"], function(event) {
        return updateProgress(event);
    });

    // 画面表示時に進捗を更新（保存前にUI上で表示を整える）
    kintone.events.on(["app.record.create.show", "app.record.edit.show"], function(event) {
        return updateProgress(event);
    });

})();
