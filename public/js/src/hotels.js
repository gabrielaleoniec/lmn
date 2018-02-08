class Hotels {
  constructor() {
    this.list = null;
  }
  
  createList(url, id, clP = null, clCh = null, prepend = true){
    this.getList(url).then(()=>this.setList(id, clP, clCh, prepend));
  }

  /**
   * Gets JSON list from given URL
   * @param {String} url //The URL address
   * @returns {Promise}
   */
  getList(url) {
		return new Promise(function(resolve, reject){
      if(typeof url === 'string' && url.length){
        let xhr = new window.XMLHttpRequest();

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

  /**
   * Sets a list to an element given by id and described by parTag && chTag
   * @param {String} id //Id of the element in which the list will be nested
   * @param {String} clP //List of classes of the list parent separeted by a space
   * @param {String} clCh //List of classes of a list child separeted by a space
   * @param {Boolean} prepend //If true - prepend the list to root, otherwise - append
   * @returns {Integer} Number of elements in the list
   */
  setList(id, clP = null, clCh = null, prepend = true) {
    if(typeof id !== 'string' || id.length === 0) {
      throw new TypeError('Argument '+id+' given to function setList is not a string'); 
    }
    
    if(clP !== null && (typeof clP !== 'string' || clP.length === 0)) {
      throw new TypeError('Argument '+clP+' given to function setList is not a string'); 
    }
    
    if(clCh !== null && (typeof clCh !== 'string' || clCh.length === 0)) {
      throw new TypeError('Argument '+clCh+' given to function setList is not a string'); 
    }  
    
    if(typeof prepend !== 'boolean') {
      throw new TypeError('Argument '+prepend+' given to function setList should be true or false'); 
    } 
    
    if(!Array.isArray(this.list) || this.list.length === 0){
      throw new TypeError('Property this.list is not an array'); 
    }
    
    if(!id.match(/^\w\S*$/i)){
      throw new TypeError('Argument id: '+id+' has wrong format'); 
    }
    
    let clM = /^[a-z][a-z0-9_\-]*(\s[a-z][a-z0-9_\-]*)*$/i;
    
    if(!clP.match(clM)){
      throw new TypeError('Argument '+clP+' has wrong format'); 
    }
    
    if(!clCh.match(clM)){
      throw new TypeError('Argument '+clCh+' has wrong format'); 
    }
    
    //TODO add regular expressions to check the arguments
    
    let parTag = 'ul', 
        chTag = 'li',
        rootEl = document.getElementById(id),
        parentEl = document.createElement(parTag);

    if(rootEl !== null){
      if(clP) {
        parentEl.setAttribute('class', clP);
      }
      for(let i in this.list){
        let tmp = this.list[i];
        if(typeof tmp === 'object' && 'id' in tmp && 'name' in tmp) {
          let el = document.createElement(chTag);
          el.setAttribute('data-id', this.list[i].id);
          if(clCh) {
            el.setAttribute('class', clCh);
          }
          el.innerHTML = this.list[i].name;
          parentEl.appendChild(el);
        } else {
          throw new TypeError('Wrong object passed in JSON list of object with hotels');
        }
      }
      if(prepend) {
        console.log('firstChild', rootEl.childElementCount, rootEl.firstElementChild );
        rootEl.insertBefore(parentEl, rootEl.childNodes[0]);
      } else {
        rootEl.appendChild(parentEl);
      }
      console.log('Final rootEl', rootEl);
      return rootEl.childElementCount;
    } else {
      console.log('Element with given id '+id+' doesn\'t exist');
      throw new Error('Element with given id '+id+' doesn\'t exist');
    }
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Hotels;
} else {
  window.Hotels = Hotels;
}
