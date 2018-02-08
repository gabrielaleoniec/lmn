'use strict';



const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');
const src_dir = '../../public/js/src/';
const Hotel = require(src_dir+'hotel.js');

console.log(Hotel, typeof Hotel);
module.exports = Hotel;

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('Hotel', () => {
  it('should exist', () => {
			expect(Hotel).to.be.a('function');
	});
  

  
  describe('#getHotel', () => {
    let hotel;
    
    beforeEach(()=>{
      hotel = new Hotel();
    });
    
    it('should throw if no argumants are passed', () => {
      let msg = 'Function getHotel needs two arguments';
      expect(()=>hotel.getHotel()).to.throw(Error, msg);
    });
    
    it('should throw if passed arguments are wrong', () => {
      let msg = 'Function getHotel needs an id of object given a string';
      expect(()=>hotel.getHotel(3, '')).to.throw(Error, msg);
      expect(()=>hotel.getHotel('', '')).to.throw(Error, msg);
    });
    
  });
});

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Hotel;
} else {
  window.Hotels = Hotel;
}
