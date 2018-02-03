'use strict';

const expect = require('chai').expect;
const nock = require('nock');
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
    let hotels = new Hotels();
    
    it('should fetch json with hotels from server', (done) => {
      global.document = dom1.window.document;
			global.window = dom1.window;
      
      // TODO: create prettier JSON
      let json = JSON.stringify([{"id":"1","name":"Hotel Sunny Palms"},{"id":"2","name":"Hotel Snowy Mountains"},{"id":"3","name":"Hotel Windy Sails"},{"id":"4","name":"Hotel Middle of Nowhere"}]);

			nock('http://localhost:8765')
					.get('/api/hotels')
					.reply(200, json);
  
      expect(hotels.list).to.be.null;

      expect(hotels.getList).to.be.a('function');
      let res = hotels.getList('http://localhost:8765/api/hotels');
      
      console.log(res);
      
			res.then(() => {
        expect(hotels.list).equals(json);
        done();            
			}).catch((err) => console.log(err));
    });
  });
  
  

});