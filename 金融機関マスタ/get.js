(function() {
	"use strict";
  const _spinner = window.KAIZEN.spinner;
 
	kintone.events.on("app.record.index.show", (e) => {
    if (document.getElementById("getButton") !== null) return e;
    
    const button = document.createElement("button");
    button.id = "getButton";
    button.innerText = "金融機関データーを取得&更新";
    kintone.app.getHeaderMenuSpaceElement().appendChild(button);
    
    button.onclick = async function() {
        const confirmAction = window.confirm("最新の金融機関情報を取得しますか？（数分かかります）");
        if (!confirmAction) return; // 「いいえ」を選択した場合は終了

        _spinner.show();

      // 現在登録されている銀行情報を取得
	    const records = await getRecords();

      // APIで金融機関情報を取得
      const banks = await getBanks();

      const insertRecords = [];
      const updateRecords = [];

      for (const [i, bank] of banks.entries()) {
        console.log(`${i+1} / ${banks.length} 件`);
 
        const branches = await getBranches(bank.code);
        for (const branch of branches) {
          const record = records.find(
            x => x.bank_code.value == bank.code &&
            x.branch_code.value == branch.code);

          if (record) {
            updateRecords.push({
              id: record.$id.value,
              record: {
                bank_code: { value: bank.code },
                bank_name: { value: bank.normalize.name },
                bank_hira: { value: bank.normalize.hira },
                bank_kana: { value: bank.normalize.kana },
                bank_roma: { value: bank.normalize.roma },
                branch_code: { value: branch.code },
                branch_name: { value: branch.normalize.name },
                branch_hira: { value: branch.normalize.hira },
                branch_kana: { value: branch.normalize.kana },
                branch_roma: { value: branch.normalize.roma },
              }
            });
          } else {
            insertRecords.push({
              bank_code: { value: bank.code },
              bank_name: { value: bank.normalize.name },
              bank_hira: { value: bank.normalize.hira },
              bank_kana: { value: bank.normalize.kana },
              bank_roma: { value: bank.normalize.roma },
              branch_code: { value: branch.code },
              branch_name: { value: branch.normalize.name },
              branch_hira: { value: branch.normalize.hira },
              branch_kana: { value: branch.normalize.kana },
              branch_roma: { value: branch.normalize.roma },
            })
          }
        }
      }

      // 新規登録
      for (const recs of splitArray(insertRecords)) {
        await postRecords(recs)
      }

      // 更新
      for (const recs of splitArray(updateRecords)) {
        await putRecords(recs)
      }
      _spinner.hide();

      alert("完了しました");

      window.location.reload();
    }

    return e;
	});
 
  // レコード全件取得
  function getRecords(app=kintone.app.getId(), query="", offset=0, records=[]) {
		const url = kintone.api.url("/k/v1/records.json", true);
		return kintone.api(url, "GET", {
			app: app,
			query: query + " limit 500 offset " + offset
		}).then((resp) => {
			records = records.concat(resp.records);
			if (resp.records.length == 500) {
				offset += 500;
				return getRecords(app, query, offset, records);
			}
			return records;
		}).catch((err) => {
			console.log(err);
			return false;
		});
	}
 
  // レコード複数登録
  function postRecords(records) {
		const url = kintone.api.url("/k/v1/records.json", true);
		return kintone.api(url, "POST", {
			app: kintone.app.getId(),
			records: records
		}).then((resp) => {
			return resp;
		}).catch((err) => {
			console.log(err);
			return false;
		});
	}
 
  // レコード複数更新
  function putRecords(records) {
		const url = kintone.api.url("/k/v1/records.json", true);
		return kintone.api(url, "PUT", {
			app: kintone.app.getId(),
			records: records
		}).then((resp) => {
			return resp;
		}).catch((err) => {
			console.log(err);
			return false;
		});
	}
 
  // 金融機関リスト取得
	function getBanks(page=1, banks=[]) {
	  const url = `https://bank.teraren.com/banks.json?page=${page}&per=500`;
	  return kintone.proxy(url, "GET", {}, {})
  		.then((resp) => {
  		  if (resp[1] == 200) {
  		    const response = JSON.parse(resp[0]);
  		    banks = banks.concat(response);
  		    if (response.length == 500) {
  		      page++;
  		      return getBanks(page, banks);
  		    }
  			  return banks;
  		  }
  			return false;
  		}).catch((error) => {
  			console.log(error);
  			return false;
  		});
	}
 
  // 支店リスト取得
	function getBranches(code, page=1, branches=[]) {
	  const url = `https://bank.teraren.com/banks/${code}/branches.json?page=${page}&per=500`;
	  return kintone.proxy(url, "GET", {}, {})
  		.then((resp) => {
  		  if (resp[1] == 200) {
  		    const response = JSON.parse(resp[0]);
  		    branches = branches.concat(response);
  		    if (response.length == 500) {
  		      page++;
  		      return getBranches(code, page, branches);
  		    }
  			  return branches;
  		  }
  			return false;
  		}).catch((error) => {
  			console.log(error);
  			return false;
  		});
	}
 
  // 配列を100件ずつ分割
  function splitArray(array, number=100) {
    const length = Math.ceil(array.length / number);
    return new Array(length).fill().map((_, i) =>
      array.slice(i * number, (i + 1) * number)
    );
  }

})();