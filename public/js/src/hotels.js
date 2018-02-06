class Hotels {
  constructor() {
    this.list = null;
  }

  getList(url) {
		return new Promise(function(resolve, reject){
      if(typeof url === 'string' && url.length){
        let xhr = new window.XMLHttpRequest();
        // It's enough to check the headers to know if an image exists
        // Last parameter is for asynchronous request
        // Could be done asynchronously with the usage of ES7 await
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
          if(xhr.readyState === 4) {
            if(xhr.status === 200 || xhr.status === 304) {
              // Getting the content-type of the response
              let ct = xhr.getResponseHeader('content-type');
              console.log(ct, typeof ct, ct.indexOf('json'));
              if(typeof ct === 'string' && ct.indexOf('json') !== -1){
                try {
                  let tmp = JSON.parse(xhr.responseText);
                  if(Array.isArray(tmp) && tmp.length > 0){
                    this.list = tmp;
                    resolve(tmp);
                  } else {
                    reject('Server didn\'t respond with a JSON array');
                  }
                } catch (err) {
                  reject(err);
                }
              } else {
                reject('Server didn\'t respond with a JSON');
              }
            } else {
              reject(xhr.status +': '+xhr.statusText);
            }
          }
        }.bind(this);
        xhr.send();
      } else {
        reject('getList: ' +url + ' is not a string');
      }
    }.bind(this));
  }

  setList() {

  }
}
