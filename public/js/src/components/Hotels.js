class Hotels {
  constructor() {
    this.list = null;
  }
  
  /**
   * Glues the functions 
   * @param {string} url
   * @param {string} id
   * @param {string} clP
   * @param {string} clCh
   * @param {boolean} prepend
   * @returns {Promise}
   */
  createList(url, id, clP = null, clCh = null, prepend = true){
    if(typeof url !== 'string' || url.length === 0){
      throw new Error('Function createList needs a valid URL');
    }
    
    let valUrl = /^(https?:)?\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if(!url.match(valUrl)){
      throw new Error('Function createList needs a valid URL');
    }
    
    if(typeof id !== 'string' || id.length === 0) {
      throw new TypeError('Argument '+id+' given to function createList is not a string'); 
    }
       
    if(clP !== null && (typeof clP !== 'string' || clP.length === 0)) {
      throw new TypeError('Argument '+clP+' given to function createList is not a string'); 
    }
    
    if(clCh !== null && (typeof clCh !== 'string' || clCh.length === 0)) {
      throw new TypeError('Argument '+clCh+' given to function createList is not a string'); 
    }  
    
    if(typeof prepend !== 'boolean') {
      throw new TypeError('Argument '+prepend+' given to function createList should be true or false'); 
    } 

    if(!id.match(/^\w\S*$/i)){
      throw new TypeError('Argument id: '+id+' has wrong format'); 
    }
    
    let clM = /^[a-z][a-z0-9_\-]*(\s[a-z][a-z0-9_\-]*)*$/i;
    
    if(clP !== null && !clP.match(clM)){
      throw new TypeError('Argument '+clP+' has wrong format'); 
    }
    
    if(clCh !== null && !clCh.match(clM)){
      throw new TypeError('Argument '+clCh+' has wrong format'); 
    }
    
    return new Promise(function(resolve, reject){
      this.getList(url)
        .then(
        ()=>{
          try {
            this.setList(id, clP, clCh, prepend);
            resolve(true);
          } catch(err) {
            reject(err);
          }
        })
        .catch((error)=>{
          reject(error);
        });
    }.bind(this));
  }

  /**
   * Gets JSON list from given URL
   * @param {String} url //The URL address
   * @returns {Promise}
   */
  getList(url) {
    if(typeof url !== 'string' || url.length === 0){
      throw new Error('Function getList needs a valid URL');
    }
    
    let valUrl = /^(https?:)?\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if(!url.match(valUrl)){
      throw new Error('Function getList needs a valid URL');
    }
    
		return new Promise(function(resolve, reject){
      let xhr = new window.XMLHttpRequest();

      xhr.open('GET', url, true);
      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
          if(xhr.status === 200 || xhr.status === 304) {
            // Getting the content-type of the response
            let ct = xhr.getResponseHeader('content-type');
            let cl = xhr.getResponseHeader('content-length');

            if(typeof ct === 'string' && ct.indexOf('json') !== -1 && cl !== 0){
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
    }.bind(this));
  }

  /**
   * Sets a list to an element given by id and described by parTag && chTag
   * @param {String} id //Id of the element in which the list will be nested
   * @param {String} clP //List of classes of the list parent separated by a space
   * @param {String} clCh //List of classes of a list child separated by a space
   * @param {Boolean} prepend //If true - prepend the list to root, otherwise - append
   * @returns {Integer} Number of elements in the list
   */
  setList(id, clP = null, clCh = null, prepend = true) {
    if(typeof id !== 'string' || id.length === 0) {
      throw new TypeError('Argument '+id+' given to function setList is not a string'); 
    }
    
    if(!Array.isArray(this.list)){
      throw new TypeError('Property this.list is not an array'); 
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

    if(!id.match(/^\w\S*$/i)){
      throw new TypeError('Argument id: '+id+' has wrong format'); 
    }
    
    let clM = /^[a-z][a-z0-9_\-]*(\s[a-z][a-z0-9_\-]*)*$/i;
    
    if(clP !== null && !clP.match(clM)){
      throw new TypeError('Argument '+clP+' has wrong format'); 
    }
    
    if(clCh !== null && !clCh.match(clM)){
      throw new TypeError('Argument '+clCh+' has wrong format'); 
    }
    
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
        rootEl.insertBefore(parentEl, rootEl.childNodes[0]);
      } else {
        rootEl.appendChild(parentEl);
      }
      return rootEl.childElementCount;
    } else {
      throw new Error('Element with given id '+id+' doesn\'t exist');
    }
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Hotels;
} else {
  window.Hotels = Hotels;
}
