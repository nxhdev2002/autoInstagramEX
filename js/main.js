"use strict";
let proxy = "https://cors-anywhere.herokuapp.com/"

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}





function hana(acc, token) {
  if (!(this instanceof hana)) {
    return new hana(acc, token);
  }
  this.acchana = acc;
  this.token = token;
  this.getJobs = async function() {
      this.id = document.getElementById('id').value;
      let headers = {
        "User-Agent": "okhttp/3.12.1",
        "authorization": "Bearer " + this.token
      }
      let url = 'https://admin.amaiteam.com/farmer/api/v1/instagram/get-farmer-job?seeding_type=6%2C7&instagram_account_id=' + this.id + '&per_page=10&page=1';
      let result = await fetch(url, {
        method: 'GET',
        // mode: 'no-cors',
        // credentials: 'include',
        headers: headers
      });
      let jsonResult = await result.json();
      document.getElementById('content').innerHTML = jsonResult.message;
      await sleep(1000);
      console.log(jsonResult.data);
      return jsonResult.data;
  };
  this.getDetail = async function(jobid) {
      let headers = {
        "User-Agent": "okhttp/3.12.1",
        "authorization": "Bearer " + this.token
      }
      let url = "https://admin.amaiteam.com/farmer/api/v1/instagram/detail?account_id=" + this.id + "&job_id=" + jobid;
      let rq = await fetch(url, {
        method: 'GET',
        headers: headers
      });
      let jsonResult = await rq.json();
      document.getElementById('content').innerHTML = jsonResult.message;
      await sleep(1000);
      return jsonResult.data;
  };
  this.startJobs = async function(jobid) {
      let headers = {
        "User-Agent": "okhttp/3.12.1",
        'Content-Type': 'application/json',
        "authorization": "Bearer " + this.token
      }
      let url = "https://admin.amaiteam.com/farmer/api/v1/instagram/start-work";
      let rq = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          'account_id': this.id,
          'job_id': jobid
        }),
        headers: headers
      });
      let jsonResult = await rq.json();
      document.getElementById('content').innerHTML = jsonResult.message;
      await sleep(1000);
      return jsonResult.data;
  };
  this.execute = async function(jobid) {
      let headers = {
        "User-Agent": "okhttp/3.12.1",
        'Content-Type': 'application/json',
        "authorization": "Bearer " + this.token
      }
      let url = "https://admin.amaiteam.com/farmer/api/v1/instagram/execute";
      let rq = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          'job_id': jobid,
          'account_id': this.id.toString()
        }),
        headers: headers
      });
      let jsonResult = await rq.json();
      document.getElementById('content').innerHTML = jsonResult.message;
      await sleep(1000);
      return jsonResult.message;
  };
  this.report = async function(jobid) {
      let headers = {
        "User-Agent": "okhttp/3.12.1",
        'Content-Type': 'application/json',
        "authorization": "Bearer " + this.token
      }
      let url = "https://admin.amaiteam.com/farmer/api/v1/instagram/report";
      let rq = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          'account_id': this.id.toString(),
          'job_id': jobid
        }),
        headers: headers
      });
      let jsonResult = await rq.json();
      document.getElementById('content').innerHTML = jsonResult.message;
      await sleep(1000);
      return jsonResult.message;
  }

}



async function getToken(acchana) {
    let url = proxy + "http://nxhdev.pro/api/hana/token.php?name=" + acchana;
    let rs = await (await fetch(url)).json();
    return rs.token;
}


document.getElementById('getGif').addEventListener('click', async () => {
  let acchana = document.getElementById('acchana').value;
  let token = await getToken(acchana);
  let hn = hana(acchana, token);
  let totalj = 0;
  while (true) {
    let alljob = await hn.getJobs();
    if (alljob.length > 0) {  
      for (let i = 0; i < alljob.length; i++) {
        // GET I4 Job

        var title = alljob[i].seeding_title;
        var idjob = alljob[i].id;
        
        // Redirect
        chrome.tabs.update(null, {'url': alljob[i].link});
        //
        await sleep(5000);
        await hn.getDetail(idjob);
        await hn.startJobs(idjob);
        chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
          if (alljob[i].seeding_type != 6) {
            await chrome.tabs.executeScript(null, {code: "document.getElementsByClassName('_6VtSN')[0].click()"});
            await sleep(8000);
            var rs = await hn.execute(idjob);
          } else {

            await chrome.tabs.executeScript(null, {code: 'function getElementByXpath(e){return document.evaluate(e,document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}getElementByXpath("//*[@class=\\"fr66n\\"]/button").click();'});
            await sleep(5000);
            var rs = await hn.execute(idjob);
          }
        });
        if (rs.search("vui") != -1) {
          hn.report(idjob);
        } else {
          totalj += 1;
          document.getElementById('total').innerHTML = "Tong: " + totalj;
        }
        await sleep(1000);
      }
    } else {
      for (var i = 10; i >= 0; i--) {
        document.getElementById('content').innerHTML = "Het job. tai lai sau " + i.toString() + "s";
        await sleep(1000);
      }
    }
  }
  
  
  // renderImage('<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>');
  // var imageData = await getGifUrl();
  // renderImage('<a href="' + imageData.url + '" target="_blank"><img class="image img-responsive img-rounded" src="' + imageData.fixed_height_small_url + '" /></a>');
});