'use strict';
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const src_dir = '../../public/js/src/';
const Hotels = require(src_dir+'hotels.js');

describe('Hotels', () => {   
	it('should exist', () => {
    expect(Hotels).to.be.a('function');
	});
  
  describe('#createList', () => {
    let hotels,
      server = 'http://localhost:8765',
      path = '/api/hotels',
      url = server+path,
      dom1,
      sandbox = sinon.createSandbox(),
      hotels_list = JSON.stringify([
        {"id":"1","name":"Hotel Sunny Palms"},
        {"id":"2","name":"Hotel Snowy Mountains"},
        {"id":"3","name":"Hotel Windy Sails"},
        {"id":"4","name":"Hotel Middle of Nowhere"}
      ]),
      wrong_hotels_list = JSON.stringify(
        {"id":"1","name":"Hotel Sunny Palms"}
      );
      
    beforeEach(function() {
      hotels = new Hotels();
      dom1 = new JSDOM(
        `<div class="hotels" id="hotels-list">
        <div id="hotel-data">
          <img class="js-imgURL"/>
          <div class="hotel__details">
            <h2 class="js-name js-rating"></h2>
            <div class="js-price"></div>
            <div class="price__info">Total hotel stay</div>
          </div>
        </div>
        </div>`
      );
      global.window = dom1.window;

this.server = sinon.createFakeServer();
console.log('server 1', this.server);
      this.xhr = sandbox.useFakeXMLHttpRequest();

      window.XMLHttpRequest = this.xhr; 
      var requests = this.requests = [];

      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      }.bind(this);
    });

    afterEach(function() {
      this.xhr.restore();
      this.server.restore();
      sandbox.restore();
    });

    it('should throw if URL passed to the function is wrong', () => {
      let msg = 'Function createList needs a valid URL';
      expect(()=>hotels.createList(0, 'foo')).to.throw(Error, msg);
      expect(()=>hotels.createList('', 'foo')).to.throw(Error, msg);
      expect(()=>hotels.createList('abc', 'foo')).to.throw(Error, msg);
      expect(()=>hotels.createList('abc.com', 'foo')).to.throw(Error, msg);
      expect(()=>hotels.createList('http://localhost', 'foo')).to.not.throw;
      expect(()=>hotels.createList('http://localhost:8765', 'foo')).to.not.throw;
      expect(()=>hotels.createList('http://localhost:8765/api/hotels', 'foo')).to.not.throw;
      expect(()=>hotels.createList('http://localhost:8765/api/hotels/3', 'foo')).to.not.throw;
      expect(()=>hotels.createList('http://api.lastminute.com/hotels', 'foo')).to.not.throw;
      expect(()=>hotels.createList('http://foo.com', 'foo')).to.not.throw;
    });
    
    it('should throw if given argument id is not a string', () => {
      let id = 3,
          error_msg = 'Argument '+id+' given to function createList is not a string';
      expect(() => hotels.createList(url, id)).to.throw(TypeError, error_msg);
    });
    
    it('should throw if given argument id is not valid', () => {
      let id = 'wrong id',
          error_msg = 'Argument id: '+id+' has wrong format';
      expect(() => hotels.createList(url, id)).to.throw(TypeError, error_msg);
    });
       
    it('should throw if given argument clP is not a string', () => {
      let clP = 3,
          error_msg = 'Argument '+clP+' given to function createList is not a string';
      expect(() => hotels.createList(url, 'foo', clP)).to.throw(TypeError, error_msg);
    });
    
    it('should throw if given argument clCh is not a string', () => {
      let clCh = 3,
          error_msg = 'Argument '+clCh+' given to function createList is not a string';
      expect(() => hotels.createList(url, 'foo', null, clCh)).to.throw(TypeError, error_msg);
    });
    
    it('should throw if given argument clCh is not a string', () => {
      let prepend = 3,
          error_msg = 'Argument '+prepend+' given to function createList should be true or false';
      expect(() => hotels.createList(url, 'foo', null, null, prepend)).to.throw(TypeError, error_msg);
    });
    
    it('should throw if given argument clP is not valid', () => {
      let error_msg, 
          wrong = ['#afsdf-3r', ' fgh'];
      
      for(let i in wrong){
        error_msg = 'Argument '+wrong[i]+' has wrong format',
        expect(() => hotels.createList(url, 'foo', wrong[i])).to.throw(TypeError, error_msg);
      }
    });
    
    it('should throw if given argument clCh is not valid', () => {
      let error_msg, 
          wrong = ['#afsdf-3r', ' fgh'];
      
      for(let i in wrong){
        error_msg = 'Argument '+wrong[i]+' has wrong format',
        expect(() => hotels.createList(url, 'foo', null, wrong[i])).to.throw(TypeError, error_msg);
      }
    });
    
    console.log('server 2', this.server);
    it('should throw if given URL gives bad response', function(done) {
      let getListSpy = sandbox.spy(hotels, "getList");
      
      console.log('server 3', this.server);
   
      hotels.createList(url, 'hotels-list').then(() => {
        expect(getListSpy.calledOnce).to.be.true;
        done();            
			}, 
      (error)=>{
        expect(getListSpy.calledOnce).to.be.true;
        expect(error).to.not.be.empty;
        expect(error).to.contain('404');
        done(); 
      });
      this.requests[0].respond(404, { 'Content-Type': 'text/json' }, wrong_hotels_list);
      
    });
  });
    
  describe('#getList', () => {
    let hotels,
      server = 'http://localhost:8765',
      path = '/api/hotels',
      url = server+path,
      dom1,
      hotels_list = JSON.stringify([
        {"id":"1","name":"Hotel Sunny Palms"},
        {"id":"2","name":"Hotel Snowy Mountains"},
        {"id":"3","name":"Hotel Windy Sails"},
        {"id":"4","name":"Hotel Middle of Nowhere"}
      ]),
      wrong_hotels_list = JSON.stringify(
        {"id":"1","name":"Hotel Sunny Palms"}
      );
      
    beforeEach(function() {
      hotels = new Hotels();
      dom1 = new JSDOM(
        `<div class="hotels" id="hotels-list">
        <div id="hotel-data">
          <img class="js-imgURL"/>
          <div class="hotel__details">
            <h2 class="js-name js-rating"></h2>
            <div class="js-price"></div>
            <div class="price__info">Total hotel stay</div>
          </div>
        </div>
        </div>`
      );
      global.window = dom1.window;
      
      this.xhr = sinon.useFakeXMLHttpRequest();
      window.XMLHttpRequest = this.xhr; 
      var requests = this.requests = [];

      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      }.bind(this);
    });

    afterEach(function() {
      this.xhr.restore();
    });
    
    it('should throw if URL passed to the function is wrong', () => {
      let msg = 'Function getList needs a valid URL';
      expect(()=>hotels.getList(0)).to.throw(Error, msg);
      expect(()=>hotels.getList('')).to.throw(Error, msg);
      expect(()=>hotels.getList('abc')).to.throw(Error, msg);
      expect(()=>hotels.getList('abc.com')).to.throw(Error, msg);
      expect(()=>hotels.getList('http://localhost')).to.not.throw;
      expect(()=>hotels.getList('http://localhost:8765')).to.not.throw;
      expect(()=>hotels.getList('http://localhost:8765/api/hotels')).to.not.throw;
      expect(()=>hotels.getList('http://localhost:8765/api/hotels/3')).to.not.throw;
      expect(()=>hotels.getList('http://api.lastminute.com/hotels')).to.not.throw;
      expect(()=>hotels.getList('http://foo.com')).to.not.throw;
    });
       
    it('should fetch json with hotels from server', function(done) {
			hotels.getList(url).then(()=> {
        let json = JSON.parse(hotels_list);

        expect(hotels.list).to.be.an('array');
        expect(hotels.list.length).to.equal(4);
        expect(hotels.list).to.eql(json);
        expect(hotels.list[0]).to.be.an('object');
        expect(hotels.list[0].name).to.equal('Hotel Sunny Palms');
        done();
      });
      
      this.requests[0].respond(200, { 'Content-Type': 'text/json' }, hotels_list);
    });
    
    it('should throw if json is not an expected array', function(done) {
			hotels.getList(url).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.not.be.empty;
        expect(error).to.equal('Server didn\'t respond with a JSON array');
        done();
      });
      
      this.requests[0].respond(200, { 'Content-Type': 'text/json' }, wrong_hotels_list);
    });
    
    it('should throw if there\'s a problem with connection', function(done) {
			hotels.getList(url).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.not.be.empty;
        expect(error).to.contain('404');
        done();
      });
      
      this.requests[0].respond(404, { 'Content-Type': 'text/html' }, null);
    });
    
    it('should throw if the respond from server is not a json', function(done) {
			hotels.getList(url).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.not.be.empty;
        expect(error).to.equal('Server didn\'t respond with a JSON');
        done();
      });
      
      this.requests[0].respond(200, { 'Content-Type': 'text/html' }, null);
    });
  });
  
  describe('#setList', () => {
    let hotels,
        sandbox = sinon.createSandbox(), 
        dom1;
    
    beforeEach(function(){
      hotels = new Hotels();
      dom1 = new JSDOM(
        `<div class="hotels" id="hotels-list">
        <div id="hotel-data">
          <img class="js-imgURL"/>
          <div class="hotel__details">
            <h2 class="js-name js-rating"></h2>
            <div class="js-price"></div>
            <div class="price__info">Total hotel stay</div>
          </div>
        </div>
        </div>`
      );
      
      global.document = dom1.window.document;
    });
    
    afterEach(function(){
      sandbox.restore();
    });
    
    it('should throw if given argument id is not a string', () => {
      let id = 3,
          error_msg = 'Argument '+id+' given to function setList is not a string';
      expect(() => hotels.setList(id)).to.throw(TypeError, error_msg);
    });
    
    it('should throw if given argument id is not valid', () => {
      let id = 'wrong id',
          error_msg = 'Argument id: '+id+' has wrong format', 
          list = [];
          
      sandbox.stub(hotels, 'list').value(list);
      expect(() => hotels.setList(id)).to.throw(TypeError, error_msg);
    });
    
    it('should throw if hotels.list is not an array', () => {
      sandbox.stub(hotels, 'list').value(null);

      let error_msg = 'Property this.list is not an array';
      expect(() => hotels.setList('foo')).to.throw(TypeError, error_msg);
    });
    
    it('should throw if given argument clP is not a string', () => {
      let clP = 3,
          error_msg = 'Argument '+clP+' given to function setList is not a string', 
          list = [];
      sandbox.stub(hotels, 'list').value(list);
      expect(() => hotels.setList('foo', clP)).to.throw(TypeError, error_msg);
    });
    
    it('should throw if given argument clCh is not a string', () => {
      let clCh = 3,
          error_msg = 'Argument '+clCh+' given to function setList is not a string', 
          list = [];
      sandbox.stub(hotels, 'list').value(list);
      expect(() => hotels.setList('foo', null, clCh)).to.throw(TypeError, error_msg);
    });
    
    it('should throw if given argument clCh is not a string', () => {
      let prepend = 3,
          error_msg = 'Argument '+prepend+' given to function setList should be true or false', 
          list = [];
      sandbox.stub(hotels, 'list').value(list);
      expect(() => hotels.setList('foo', null, null, prepend)).to.throw(TypeError, error_msg);
    });
    
    it('should throw if given argument clP is not valid', () => {
      let error_msg,
          list = [], 
          wrong = ['#afsdf-3r', ' fgh'];
          
      sandbox.stub(hotels, 'list').value(list);
      
      for(let i in wrong){
        error_msg = 'Argument '+wrong[i]+' has wrong format',
        expect(() => hotels.setList('foo', wrong[i])).to.throw(TypeError, error_msg);
      }
    });
    
    it('should throw if given argument clCh is not valid', () => {
      let error_msg,
          list = [], 
          wrong = ['#afsdf-3r', ' fgh'];
          
      sandbox.stub(hotels, 'list').value(list);
      
      for(let i in wrong){
        error_msg = 'Argument '+wrong[i]+' has wrong format',
        expect(() => hotels.setList('foo', null, wrong[i])).to.throw(TypeError, error_msg);
      }
    });
    
    it('should throw if element with given id doesn\'t exist', () => {
      sandbox.stub(hotels, 'list').value([
          {"id":"1","name":"Hotel Sunny Palms"},
          {"id":"2","name":"Hotel Snowy Mountains"},
          {"id":"3","name":"Hotel Windy Sails"},
          {"id":"4","name":"Hotel Middle of Nowhere"}
      ]);
      
      let id = 'foo',
          error_msg = 'Element with given id '+id+' doesn\'t exist';
      expect(() => hotels.setList(id)).to.throw(Error, error_msg);
    });
    
    it('should throw if JSON list of hotel doesn\'t contain id or name key', () => {
      sandbox.stub(hotels, 'list').value([
          {"id":"1"},
          {"id":"2","name":"Hotel Snowy Mountains"},
          {"id":"3","name":"Hotel Windy Sails"},
          {"id":"4","name":"Hotel Middle of Nowhere"}
      ]);
      
      let id = 'hotels-list',
          error_msg = 'Wrong object passed in JSON list of object with hotels';
      expect(() => hotels.setList(id)).to.throw(Error, error_msg);
    });
    
    it('should prepend a list of elements as children of a given HTML element with an ID', () => {
      let parTag = 'ul',
          chTag = 'li',
          spyCrEl = sandbox.spy(document, 'createElement');
        
      sandbox.stub(hotels, 'list').value([
          {"id":"1","name":"Hotel Sunny Palms"},
          {"id":"2","name":"Hotel Snowy Mountains"},
          {"id":"3","name":"Hotel Windy Sails"},
          {"id":"4","name":"Hotel Middle of Nowhere"}
      ]);     

      let id = 'hotels-list',
          rootEl = document.getElementById(id),
          initialNumChildren = rootEl.childElementCount,
          finalNumChildren = 0;

      expect(rootEl).to.not.be.null;
      expect(initialNumChildren).to.be.equal(1);
      
      hotels.setList(id);
      expect(spyCrEl.withArgs(parTag).calledOnce).to.be.true;
      expect(spyCrEl.withArgs(chTag).callCount).to.equal(hotels.list.length);
 
      finalNumChildren = document.getElementById(id).childElementCount;
      expect(finalNumChildren).to.be.a("number");
      expect(finalNumChildren === initialNumChildren + hotels.list.length);
      expect(rootEl.firstElementChild.nodeName).to.equal("UL");
      expect(rootEl.lastElementChild.nodeName).to.equal("DIV");
    });
    
    it('should append a list of elements as children of a given HTML element with an ID', () => {
      let parTag = 'ul',
          chTag = 'li',
          spyCrEl = sandbox.spy(document, 'createElement');

      sandbox.stub(hotels, 'list').value([
          {"id":"1","name":"Hotel Sunny Palms"},
          {"id":"2","name":"Hotel Snowy Mountains"},
          {"id":"3","name":"Hotel Windy Sails"},
          {"id":"4","name":"Hotel Middle of Nowhere"}
      ]);     

      let id = 'hotels-list',
          rootEl = document.getElementById(id),
          initialNumChildren = rootEl.childElementCount,
          finalNumChildren = 0;

      expect(rootEl).to.not.be.null;
      expect(initialNumChildren).to.be.equal(1);
      
      hotels.setList(id, null, null, false);
      expect(spyCrEl.withArgs(parTag).calledOnce).to.be.true;
      expect(spyCrEl.withArgs(chTag).callCount).to.equal(hotels.list.length);
 
      finalNumChildren = document.getElementById(id).childElementCount;
      expect(finalNumChildren).to.be.a("number");
      expect(finalNumChildren === initialNumChildren + hotels.list.length);
      expect(rootEl.firstElementChild.nodeName).to.equal("DIV");
      expect(rootEl.lastElementChild.nodeName).to.equal("UL");
    });
    
    it('should prepend a list of elements as children of a given HTML element with an ID and add a class to each element and their parent', () => {
      let parTag = 'ul',
          chTag = 'li',
          spyCrEl = sandbox.spy(document, 'createElement');

      sandbox.stub(hotels, 'list').value([
          {"id":"1","name":"Hotel Sunny Palms"},
          {"id":"2","name":"Hotel Snowy Mountains"},
          {"id":"3","name":"Hotel Windy Sails"},
          {"id":"4","name":"Hotel Middle of Nowhere"}
      ]);     

      let id = 'hotels-list',
          rootEl = document.getElementById(id),
          initialNumChildren = rootEl.childElementCount,
          finalNumChildren = 0;

      expect(rootEl).to.not.be.null;
      expect(initialNumChildren).to.be.equal(1);
      
      hotels.setList(id, 'list', 'child-list');
      expect(spyCrEl.withArgs(parTag).calledOnce).to.be.true;
      expect(spyCrEl.withArgs(chTag).callCount).to.equal(hotels.list.length);
 
      finalNumChildren = document.getElementById(id).childElementCount;
      expect(finalNumChildren).to.be.a("number");
      expect(finalNumChildren === initialNumChildren + hotels.list.length);
      expect(rootEl.firstElementChild.nodeName).to.equal("UL");
      expect(rootEl.lastElementChild.nodeName).to.equal("DIV");
      expect(rootEl.firstElementChild.className).to.contain("list");
    });
  });
});

