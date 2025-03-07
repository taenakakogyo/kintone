(function() {
    "use strict";

    kintone.events.on(["app.record.edit.change.チェック", "app.record.create.change.チェック", "app.record.edit.submit", "app.record.create.submit"], function(event) {
        var record = event.record;
        var table = record.チェック.value; // テーブルのデータ

        if (table.length === 0) {
            record.進捗.value = "未着手"; // テーブルが空なら未着手
            return event;
        }

        var checkedCount = table.filter(row => row.value.済.value.includes("済")).length; // "済" にチェックが入っている行の数
        var totalCount = table.length; // テーブルの行数

        if (checkedCount === 0) {
            record.進捗.value = "未着手"; // 1つもチェックされていない
        } else if (checkedCount === totalCount) {
            record.進捗.value = "完了"; // すべての行にチェックが入っている
        } else {
            record.進捗.value = "実施中"; // 一部の行だけチェックされている
        }

        return event;
    });

})();
