class Hotel {
  constructor(){
    this.data = null;
  }
  
  addEvents(id, url, targetId, clName = null){
    if(arguments.length < 3){
      throw new Error('Function getHotel needs two arguments');
    }
    
    if(typeof id !== 'string' || id.length === 0) {
      throw new TypeError('Argument id '+id+' given to function setList is not a string'); 
    }
    
    if(!id.match(/^\w\S*$/i)){
      throw new TypeError('Argument id: '+id+' has wrong format'); 
    }
    
    if(clName !== null && typeof clName !== 'string' || clName.length === 0) {
      throw new TypeError('Argument class '+clName+' given to function setList is not a string'); 
    }
    
    let clM = /^[a-z][a-z0-9_\-]*$/i;
    if(clName !== null && !clName.match(clM)){
      throw new TypeError('Given class name is not valid');
    }

    let event = 'click',
        rootEl = document.getElementById(id), 
        els;

    if(rootEl === null) {
      throw new Error('Element with given id '+id+' doesn\'t exist');
    }

    if(clName === null){
      els = rootEl.getChildren();
    } else {
      els = rootEl.getElementsByClassName(clName);
    }
    
    let _self = this;

    for(let i = 0; i < els.length; i++) {
      els[i].addEventListener(event, function list(){
        let idH = this.dataset.id;
        _self.getHotel(url, idH).then(()=>{
          _self.setHotel();
        });
      });
    }
    console.log('Klik', this);
  }

  /**
   * Gets data of a hotel from given URL in a form of JSON
   * @param {string} url
   * @param {atring} idH
   * @returns {Promise}
   */
  getHotel(url, idH){
    //URL validation
    if(arguments.length !== 2){
      throw new Error('Function getHotel needs two arguments');
    }

    if(typeof url !== 'string' || url.length === 0){
      throw new Error('Function getHotel needs a valid URL');
    }
    
    let valUrl = /^(https?:)?\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if(!url.match(valUrl)){
      throw new Error('Function getHotel needs a valid URL');
    }
    
    // Id validataion
    if(typeof idH !== 'string' || idH.length === 0 || !idH.match(/^\w$/)){
      throw new Error('Function getHotel needs an id of the hotel');
    }   
    
    url = url.replace(/\/$/, '')+'/'.idH;
    
    return new Promise(function(resolve, reject){
      let xhr = new window.XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
          if(xhr.status === 200 || xhr.status === 304) {
            let ct = xhr.getResponseHeader('content-type'),
                resp = xhr.responseText;
            if(typeof ct === 'string' && ct.indexOf('json') !== -1 && resp !== null && resp.length>0){
              try {
                let tmp = JSON.parse(resp);
                if('name' in tmp) {
                  this.data = tmp;
                  resolve(tmp);
                } else {
                  reject('JSON doesn\'t have the name field');
                }
              } catch (e) {
                reject(e);
              };
            } else {
              reject('The server didn\'t respond with a JSON');
            }
          } else {
            reject(xhr.status +': '+xhr.statusText+'('+url+')');
          }
        }
      }.bind(this);
      xhr.send();
    }.bind(this));
  }
  
  setHotel(id, classes = null){
    if(typeof id !== 'string' || id.length === 0) {
      throw new TypeError('Argument id '+id+' given to function setList is not a string'); 
    }
    
    if(!id.match(/^\w\S*$/i)){
      throw new TypeError('Argument id: '+id+' has wrong format'); 
    }
    
    if(this.data === null || typeof this.data !== 'object' || !('name' in this.data)){
      throw new TypeError('Property this.data is not a valid object'); 
    }
    
    if(typeof classes === 'object' && classes !== null && !('name' in classes)){
      throw new TypeError('Object classes is not valid'); 
    }
    
    let clM = /^[a-z][a-z0-9_\-]*(\s[a-z][a-z0-9_\-]*)*$/i;
    
    for(let cl in classes) {
      if(typeof classes[cl] !== 'string' || classes[cl].length === 0 || !classes[cl].match(clM)) {
        throw new TypeError('Classes names in classes are not valid');
      }
    }
    
    let rootEl = document.getElementById(id);
    
    if(rootEl === null){
      throw new Error('Element with given id '+id+' doesn\'t exist');
    }
    
    for(let prop in this.data) {
      let els = rootEl.getElementsByClassName('js-'+prop);
      
      for(let i = 0; i < els.length; i++) {
        if(els[i] !== undefined){
          if(prop === 'name' || prop === 'price') {
            els[i].innerHTML = this.data[prop];
          }
          if(prop === 'imgUrl') {
            els[i].setAttribute("src", this.data[prop]);
          }
          if(prop === 'rating') {
            els[i].className.replace(/^rating-[0-9]$/, '');
            els[i].className+= ' rating-'+this.data[prop];
          }
          
          if(classes !== null && classes[prop] !== undefined){
            els[i].classList.add(classes[prop]);
          }
        }
      }
    }
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Hotel;
} else {
  window.Hotels = Hotel;
}