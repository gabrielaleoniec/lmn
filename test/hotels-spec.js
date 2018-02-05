'use strict';

const expect = require('chai').expect;
const should = require('chai').should;
const nock = require('nock');
const sinon = require('sinon');
const src_dir = '../public/js/src/';
const { JSDOM } = require('jsdom');
const Hotels = require(src_dir+'hotels.js');

const dom1 = new JSDOM(
  { includeNodeLocations: true }
);

describe('Hotels', () => {
	it('should exist', () => {
    expect(Hotels).to.be.a('function');
	});
  
  describe('#getList', () => {
    let hotels = new Hotels(),
      server = 'http://jsonplaceholder.typicode.com', //'http://localhost:8765',
      path = '/posts/1',
      url = server+path;

    var json = JSON.stringify([
        {"id":"1","name":"Hotel Sunny Palms"},
        {"id":"2","name":"Hotel Snowy Mountains"},
        {"id":"3","name":"Hotel Windy Sails"},
        {"id":"4","name":"Hotel Middle of Nowhere"}
      ]),
      wrong_json = JSON.stringify(
        {"id":"1","name":"Hotel Sunny Palms"}
      );
      
    beforeEach(function() {
      this.xhr = sinon.useFakeXMLHttpRequest();

      var requests = this.requests = [];

      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      }.bind(this);
    });

    afterEach(function() {
      this.xhr.restore();
    });
       
    it('should fetch json with hotels from server', function(done) {
      var callback = sinon.spy();
      global.window = dom1.window;

			hotels.getList(url, callback);
      
      console.log('this 1',this);
      
      this.requests[0].respond(200, { 'Content-Type': 'text/json' }, wrong_json);
      
      //assert(callback.calledWith(wrong_json));
      
      console.log('this 2',this);
    });
  });
});