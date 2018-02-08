class Hotel {
  constructor(){
    this.data = null;
  }
  

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
      
      console.log(els[0]);
      
      for(let i = 0; i < els.length; i++) {
        console.log('petla');
        if(els[i] !== undefined){
          if(prop === 'name' || 'price') {
            console.log('name lub price');
            els[i].innerHTML = this.data[prop];
          }
        }
      }
      
      console.log('b');
    }
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Hotel;
} else {
  window.Hotels = Hotel;
}