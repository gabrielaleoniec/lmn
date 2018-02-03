class Hotels {
  constructor() {
    this.list = null;
  }

  getList(url) {
    console.log('++++this----', this);
    return new Promise(function(resolve, reject){
      console.log('>>>>this----', this);
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
          resolve();
				} else {
					reject('Error in sending a request '+ url + ' status: '+xhr.status + ' message: '+xhr.statusText);
				}
			} else {
				reject('checkImage: ' +url + ' is not a string');
			}
		}.bind(this));
  }

  setList() {

  }
}

module.exports = Hotels;