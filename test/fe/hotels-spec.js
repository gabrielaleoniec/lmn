var expect = chai.expect;
var assert = chai.assert;

describe('Hotels', () => {
	it('should exist', () => {
    expect(Hotels).to.be.a('function');
	});
  
  describe('#getList', () => {
    let hotels,
      server = 'http://localhost:8765',
      path = '/api/hotels',
      url = server+path,
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
      this.xhr = sinon.useFakeXMLHttpRequest();
      hotels = new Hotels();

      var requests = this.requests = [];

      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      }.bind(this);
    });

    afterEach(function() {
      this.xhr.restore();
    });
       
    it('should fetch json with hotels from server', function(done) {
			hotels.getList(url).then((result)=> {
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
    
    it('should throw an error if json is not an expected array', function(done) {
			hotels.getList(url).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.not.be.empty;
        expect(error).to.equal('Server didn\'t respond with a JSON array');
        done();
      });
      
      this.requests[0].respond(200, { 'Content-Type': 'text/json' }, wrong_hotels_list);
    });
    
    it('should throw an error if there\'s a problem with connection', function(done) {
			hotels.getList(url).then((result) => {
        throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
      }, (error) => {
        expect(error).to.not.be.empty;
        expect(error).to.contain('404');
        done();
      });
      
      this.requests[0].respond(404, { 'Content-Type': 'text/html' }, null);
    });
    
    it('should throw an error if the respond from server is not a json', function(done) {
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
        sandbox = sinon.createSandbox();;
    
    beforeEach(function(){
      hotels = new Hotels();
      // TODO add a stub
      
      
    });
    
    afterEach(function(){
      sandbox.restore();
    });
    
    it('should throw an error when hotels.list is not an array', function(){
      sandbox.stub(hotels, 'list').value(null);

      expect(() => hotels.setList('foo')).to.throw(TypeError, 'this.list is not an array');
    });
    
  });
});