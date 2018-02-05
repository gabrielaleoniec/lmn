class Hotels {
  constructor() {
    this.list = null;
  }

  getList(url, callback) {
    if(typeof url === 'string' && url.length){
      let xhr = new window.XMLHttpRequest();
      // It's enough to check the headers to know if an image exists
      // Last parameter is for asynchronous request
      // Could be done asynchronously with the usage of ES7 await
      xhr.open('GET', url, false);
      xhr.send();
      if(xhr.status === 200 || xhr.status === 304) {
        // TODO: check if it's a proper JSON
        this.list = xhr.responseText;
        callback(null, JSON.parse(xhr.responseText));
      } else {
        callback(xhr.status);
      }
    } else {
      throw new Error('getList: ' +url + ' is not a string');
    }
  }

  setList() {

  }
}

module.exports = Hotels;