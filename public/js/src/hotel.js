class Hotel {
  constructor(){
    this.data = null;
  }
  
  exFuns(url, idH, targetId){
    if(arguments.length !== 3){
      throw new Error('Function exFuns needs three arguments');
    }
    
    if(typeof url !== 'string' || url.length === 0){
      throw new Error('Function exFuns needs a valid URL');
    }
    
    let valUrl = /^(https?:)?\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if(!url.match(valUrl)){
      throw new Error('Function exFuns needs a valid URL');
    }
    
    if(typeof idH === "number"){
      idH = idH.toString();
    }
    
    // Id validataion
    if(typeof idH !== 'string'|| idH.length === 0 || !idH.match(/^\w$/)){
      throw new TypeError('Function exFuns needs an id of the hotel');
    }
    
    if(typeof targetId !== 'string' || targetId.length === 0) {
      throw new TypeError('Argument targetId '+targetId+' given to function exFuns is not a string'); 
    }
    
    if(!targetId.match(/^\w\S*$/i)){
      throw new Error('Argument targetId: '+targetId+' has wrong format'); 
    }

    return new Promise(function(resolve, reject){
      this.getHotel(url, idH)
        .then(
        ()=>{
          try {
            this.setHotel(targetId);
            resolve('ok');
          } catch(e) {
            reject(e);
          }
        },
        (e)=>{
          reject(e);
        }
        );
    }.bind(this));
  }
  
  addEvents(url, id, targetId, clName = null){
    if(arguments.length < 3){
      throw new Error('Function addEvents needs at least three arguments');
    }
    
    if(typeof url !== 'string' || url.length === 0){
      throw new Error('Function addEvents needs a valid URL');
    }
    
    let valUrl = /^(https?:)?\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if(!url.match(valUrl)){
      throw new Error('Function addEvents needs a valid URL');
    }
    
    if(typeof id !== 'string' || id.length === 0) {
      throw new TypeError('Argument id '+id+' given to function addEvents is not a string'); 
    }
    
    if(!id.match(/^\w\S*$/i)){
      throw new Error('Argument id: '+id+' has wrong format'); 
    }
    
    if(typeof targetId !== 'string' || targetId.length === 0) {
      throw new TypeError('Argument targetId '+targetId+' given to function addEvents is not a string'); 
    }
    
    if(!targetId.match(/^\w\S*$/i)){
      throw new Error('Argument targetId: '+targetId+' has wrong format'); 
    }
    
    if(clName !== null && (typeof clName !== 'string' || clName.length === 0)) {
      throw new TypeError('Argument class '+clName+' given to function addEvents is not a string'); 
    }
    
    let clM = /^[a-z][a-z0-9_\-]*$/i;
    if(clName !== null && !clName.match(clM)){
      throw new Error('Given class name is not valid');
    }

    let event = 'click',
        rootEl = document.getElementById(id), 
        targetEl = document.getElementById(targetId), 
        els;

    if(rootEl === null) {
      throw new Error('Element with given id '+id+' doesn\'t exist');
    }
       
    if(targetEl === null) {
      throw new Error('Element with given target id '+targetId+' doesn\'t exist');
    }

    if(clName === null){
      els = document.getElementsByTagName('li');
    } else {
      els = document.getElementsByClassName(clName);
    }
    
    let _self = this,
        idH;

    for(let i = 0; i < els.length; i++) {
      els[i].addEventListener(event, function(e){
        idH = e.target.dataset.id;
        _self.exFuns(url, idH, targetId);
      });
    }
  }

  /**
   * Gets data of a hotel from given URL in a form of JSON
   * @param {string} url URL of the server responding with JSON with hotel data
   * @param {atring} idH id of the hotel we want to get
   * @returns {Promise} JSON with hotel data
   */
  getHotel(url, idH){
    //URL validation
    if(arguments.length !== 2){
      throw new Error('Function getHotel needs two arguments');
    }

    if(typeof url !== 'string' || url.length === 0){
      throw new TypeError('Function getHotel needs a valid URL');
    }
    
    let valUrl = /^(https?:)?\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    if(!url.match(valUrl)){
      throw new Error('Function getHotel needs a valid URL');
    }
    
    if(typeof idH === "number"){
      idH+='';
    }
    
    // Id validataion
    if(typeof idH !== 'string'|| idH.length === 0 || !idH.match(/^\w$/)){
      throw new Error('Function getHotel needs an id of the hotel');
    }   
    
    url = url.replace(/\/$/, '')+'/'+idH;
    
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
              }
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
  
  /**
   * Sets hotel data retrieved from JSON to a HTML node given by id
   * @param {string} id Id of the target element to which set hotel data
   * @param {object} classes Object containg list of classes, 
   *     where name of each key corresponds to the key in hotel data JSON
   * @returns {undefined}
   */
  setHotel(id, classes = null){
    if(arguments.length < 1){
      throw new Error('Function setHotel needs at least one argument');
    }
    
    if(typeof id !== 'string' || id.length === 0) {
      throw new TypeError('Argument id '+id+' given to function setList is not a string'); 
    }
    
    if(!id.match(/^\w\S*$/i)){
      throw new Error('Argument id: '+id+' has wrong format'); 
    }
    
    if(this.data === null || typeof this.data !== 'object' || !('name' in this.data)){
      throw new Error('Property this.data is not a valid object'); 
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
       
    rootEl.dataset.id = this.data[id];
            
    for(let prop in this.data) {
      let els = rootEl.getElementsByClassName('js-'+prop);

      for(let i = 0; i < els.length; i++) {
        if(els[i] !== undefined){
          if(prop === 'name') {
            els[i].innerHTML = this.data[prop];
          }
          if(prop === 'price') {
            //TODO: should take into account the currency and comma format
            els[i].innerHTML = '&pound;'+this.data[prop].toFixed(2);
          }
          if(prop === 'imgUrl') {
            
            if(els[i].nodeName === 'IMG') {
              els[i].setAttribute("src", 'http://localhost:8765/api/'+this.data[prop]);
            } else {             
              els[i].style.backgroundImage = 'url(\'http://localhost:8765/api/'+this.data[prop]+'\')';
            }
          }
          if(prop === 'rating') {
            let cl = els[i].className.replace(/ rating--[0-9]/, '');
            els[i].className = cl+' rating--'+this.data[prop];
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