'use strict';

const expect = require('chai').expect;
const assert = require('chai').assert;
const sinon = require('sinon');
const src_dir = '../../public/js/src/';
const Hotel = require(src_dir+'hotel.js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom1 = new JSDOM(
  `<ul class="hotels__list">
    <li data-id="1" class="list__element">Hotel Sunny Palms</li>
    <li data-id="2" class="list__element">Hotel Snowy Mountains</li>
    <li data-id="3" class="list__element">Hotel Windy Sails</li>
    <li data-id="4" class="list__element">Hotel Middle of Nowhere</li>
  </ul>
  <div id="hotel-data">
    <img class="js-imgURL"/>
    <div class="hotel__details">
      <h2 class="js-name js-rating"></h2>
      <div class="js-price"></div>
      <div class="price__info">Total hotel stay</div>
    </div>
  </div>`,
  { runScripts: "dangerously" }
);

describe('Hotel', () => {
  it('should exist', () => {
			expect(Hotel).to.be.a('function');
	});
  
  describe('#getHotel', () => {
    let hotel,
        server = 'http://localhost:8765',
        path = '/api/hotels/',
        id = '1',
        url = server+path;
    
    beforeEach(function() {
      hotel = new Hotel();
			global.window = dom1.window;
      
      this.xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = this.xhr; 
      var requests = this.requests = [];

      this.xhr.onCreate = function (xhr) {
          requests.push(xhr);
      };
    });

    afterEach(function() {
      this.xhr.restore();
    });
    
    it('should throw if no argumants are passed', () => {
      let msg = 'Function getHotel needs two arguments';
      expect(()=>hotel.getHotel()).to.throw(Error, msg);
    });
    
    it('should throw if URL passed to the function is wrong', () => {
      let msg = 'Function getHotel needs a valid URL';
      expect(()=>hotel.getHotel(0, '3')).to.throw(Error, msg);
      expect(()=>hotel.getHotel('', '3')).to.throw(Error, msg);
      expect(()=>hotel.getHotel('abc', '3')).to.throw(Error, msg);
      expect(()=>hotel.getHotel('abc.com', '3')).to.throw(Error, msg);
      expect(()=>hotel.getHotel('http://localhost', '3')).to.not.throw;
      expect(()=>hotel.getHotel('http://localhost:8765', '3')).to.not.throw;
      expect(()=>hotel.getHotel('http://localhost:8765/api/hotels', '3')).to.not.throw;
      expect(()=>hotel.getHotel('http://localhost:8765/api/hotels/3', '3')).to.not.throw;
      expect(()=>hotel.getHotel('http://api.lastminute.com/hotels', '3')).to.not.throw;
    });
    
    it('should throw if id passed to the function of a hotel is wrong', () => {
      let msg = 'Function getHotel needs an id of the hotel';
      expect(()=>hotel.getHotel('http://foo.com', 3)).to.throw(Error, msg);
      expect(()=>hotel.getHotel('http://foo.com', '')).to.throw(Error, msg);
      expect(()=>hotel.getHotel('http://foo.com', 'wrong id')).to.throw(Error, msg);
      expect(()=>hotel.getHotel('http://foo.com', '3')).to.not.throw;
      expect(()=>hotel.getHotel('http://foo.com', 'foo-boo')).to.not.throw;
    });
    
    it('should return an error if there\'s a problem with connection', function(done) {     
			hotel.getHotel(url, id).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.contain('404');
        done();
      });
      
      this.requests[0].respond(404, { 'Content-Type': 'text/html' }, null);
    });
    
    it('should return an error if server doesn\'t respond with a JSON', function(done) {     
			hotel.getHotel(url, id).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.be.equal('The server didn\'t respond with a JSON');
        done();
      });
      
      this.requests[0].respond(200, { 'Content-Type': 'text/html' }, null);
    });
    
    it('should return an error if the returned JSON is null', function(done) {     
			hotel.getHotel(url, id).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.be.equal('The server didn\'t respond with a JSON');
        done();
      });
      
      this.requests[0].respond(200, { 'Content-Type': 'application/json'}, null);
    });
    
    it('should return an error if the returned JSON is wrong', function(done) {     
			hotel.getHotel(url, id).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.be.an('error');
        done();
      });
      
      this.requests[0].respond(200, { 'Content-Type': 'application/json'}, '[{ "id": 12, }]');
    });
    
    it('should return an error if the JSON doesn\'t have required fields', function(done) {
      let wrong_hotel_JS = JSON.stringify(
        {"id":"1"}
      );
      
			hotel.getHotel(url, id).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.be.equal('JSON doesn\'t have the name field');
        done();
      });
      
      this.requests[0].respond(200, { 'Content-Type': 'application/json'}, wrong_hotel_JS);
    });
    
    it('should return a valid JSON if the server responds properly', function(done) {
      let hotel_JS = JSON.stringify({ 
          "name":"Hotel Sunny Palms",
          "imgUrl":"images/sunny.jpg",
          "rating":5,
          "price":108,
          "id":1});
            
			hotel.getHotel(url, id).then((result) => {
        expect(result).to.be.an('object');
        expect(result).to.eql(JSON.parse(hotel_JS));
        expect(hotel.data).to.eql(JSON.parse(hotel_JS));
        done();
      });

      this.requests[0].respond(200, { 'Content-Type': 'application/json'}, hotel_JS);
    });
  });
  
  describe('#setHotel', () => {
    let hotel,
        sandbox = sinon.createSandbox(), 
        hotel_JS;
    
    beforeEach(function(){
      hotel = new Hotel();
      
      hotel_JS = JSON.stringify({ 
          "name":"Hotel Sunny Palms",
          "imgUrl":"images/sunny.jpg",
          "rating":5,
          "price":108,
          "id":1});
    });
    
    afterEach(function(){
      sandbox.restore();
    });
    
    it('should throw an error when given argument id is not a string', () => {
      let id = 3,
          error_msg = 'Argument id '+id+' given to function setList is not a string';
      expect(() => hotel.setHotel(id)).to.throw(TypeError, error_msg);
    });
    
    it('should throw an error when given argument id is not valid', () => {
      let id = 'wrong id',
          error_msg = 'Argument id: '+id+' has wrong format';
      expect(() => hotel.setHotel(id)).to.throw(TypeError, error_msg);
    });
    
    it('should throw an error when hotel.data is not a JSON object', () => {
      let error_msg = 'Property this.data is not a valid object';
      sandbox.stub(hotel, 'data').value(null);
      expect(() => hotel.setHotel('foo')).to.throw(TypeError, error_msg);
    });
    
    it('should throw if object classes is not null, but is a wrong object', ()=>{
      let msg = 'Object classes is not valid';
      sandbox.stub(hotel, 'data').value(JSON.parse(hotel_JS));    
      expect(() => hotel.setHotel('foo', {'foo': 'foo'})).to.throw(TypeError, msg);
    });
    
    it('should throw if object classes contain invalid class names', ()=>{
      let msg = 'Classes names in classes are not valid';
      sandbox.stub(hotel, 'data').value(JSON.parse(hotel_JS));    
      expect(() => hotel.setHotel('foo', {'name': '123foo'})).to.throw(TypeError, msg);
    });
    
    it('should throw an error when element with given id doesn\'t exist', () => {
      sandbox.stub(hotel, 'data').value(JSON.parse(hotel_JS));
      global.document = dom1.window.document;

      let id = 'foo',
          error_msg = 'Element with given id '+id+' doesn\'t exist';
      expect(() => hotel.setHotel('foo')).to.throw(Error, error_msg);
    });
    
    it('should fill the appropriate fields in DOM', () => {
      let classes = {
        'name': 'hotel__name',
        'imgUrl': 'hotel__image',
        'price': 'price__value'
      };
      sandbox.stub(hotel, 'data').value(JSON.parse(hotel_JS));
      global.document = dom1.window.document;
      
      expect(() => hotel.setHotel('hotel-data', classes)).to.not.throw;

      expect(document.getElementsByClassName('js-name')[0].innerHTML).to.be.empty;
      expect(document.getElementsByClassName('js-price')[0].innerHTML).to.be.empty;
      expect(document.getElementsByClassName('js-imgURL')[0].src).to.be.empty;
      expect(document.getElementsByClassName('js-rating')[0].className).to.not.contain('rating-5');
      hotel.setHotel('hotel-data', classes);
      expect(document.getElementsByClassName('js-name')[0].innerHTML).to.be.equal(hotel.data['name']);
      expect(document.getElementsByClassName('js-price')[0].innerHTML).to.be.equal(hotel.data['price']+'');
      expect(document.getElementsByClassName('js-imgURL')[0].src).to.be.equal(hotel.data['imgUrl']);
      expect(document.getElementsByClassName('js-rating')[0].className).to.contain('rating-5');
      //expect(document.getElementsByClassName('js-name')[0].className).to.contain(classes.name);
      //expect(document.getElementsByClassName('js-price')[0].className).to.contain(classes.price);
      //expect(document.getElementsByClassName('js-imgURL')[0].className).to.contain(classes.imgURL);
    });
  });
});

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Hotel;
} else {
  window.Hotels = Hotel;
}
