class Hotels {
  constructor() {
    this.list = null;
    this.parentType = 'ul';
    this.childType = 'li';
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

  setList(id) {
    if(Array.isArray(this.list) && this.list.length>0){
      let rootEl = document.getElementById(id),
          parentEl = document.createElement(this.parentType);
      for(let obj in this.list){
        let el = document.createElement(this.childType);
        el.setAttribute('data-id', obj.id);
        el.innerHTML = obj.name;
        parentEl.appendChild(el);
      }
      rootEl.appendChild(parentEl);
      console.log('rootEl', rootEl);
      return rootEl.childElementCount;
    } else {
      
      let error = new TypeError('this.list is not an array'); 
      console.log('Rzucamy błędem', error);
      throw error;
    }
  }
}
