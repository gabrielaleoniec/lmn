class Hotel {
  constructor(){
    
  }
  

  getHotel(url, idH){
    if(arguments.length !== 2){
      throw new Error('Function getHotel needs two arguments');
    }

    if(typeof url !== 'string' || url.length === 0){
      throw new Error('Function getHotel needs a valid URL');
    }
    
    let valUrl = /^(https?:)?\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    
    if(!url.match(valUrl)){
      console.log('zły url');
      throw new Error('Function getHotel needs a valid URL');
    }
    
    if(typeof idH !== 'string' || idH.length === 0 || !idH.match(/^\w$/)){
      throw new Error('Function getHotel needs an id of the hotel');
    }   
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Hotel;
} else {
  window.Hotels = Hotel;
}