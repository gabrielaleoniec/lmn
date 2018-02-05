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
    let hotels = new Hotels(),
    server = 'http://localhost:8765', //'http://localhost:8765',
        path = '/api/hotels',
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
    
    beforeEach(()=>{
        nock.disableNetConnect('http://localhost:8765'); 
        nock.disableNetConnect('http://localhost');
        nock(server)
					.get(path)
					.reply(404, wrong_json);
      });
      
      afterEach(()=>{
        nock.cleanAll();
      });
    
    it('should fetch json with hotels from server', (done) => {
      global.window = dom1.window;
      
      expect(hotels.list).to.be.null;
      expect(hotels.getList).to.be.a('function');
      
			hotels.getList(url).then(() => {
        expect(hotels.list).equals(wrong_json);
        done();       
			}).catch(err => console.error(err));
    });
  });
  
  

});