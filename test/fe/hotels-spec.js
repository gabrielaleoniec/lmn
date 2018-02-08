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
      hotels = new Hotels();
      
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
    });
    
    afterEach(function(){
      sandbox.restore();
    });
    
    it('should throw an error when given argument is not a string', () => {
      let id = 3,
          error_msg = 'Argument '+id+' given to function setList is not a string';
      expect(() => hotels.setList(id)).to.throw(TypeError, error_msg);
    });
    
    it('should throw an error when hotels.list is not an array', () => {
      sandbox.stub(hotels, 'list').value(null);

      let error_msg = 'Property this.list is not an array';
      expect(() => hotels.setList('foo')).to.throw(TypeError, error_msg);
    });
    
    it('should throw an error when element with given id doesn\'t exist', () => {
      sandbox.stub(hotels, 'list').value([
          {"id":"1","name":"Hotel Sunny Palms"},
          {"id":"2","name":"Hotel Snowy Mountains"},
          {"id":"3","name":"Hotel Windy Sails"},
          {"id":"4","name":"Hotel Middle of Nowhere"}
      ]);
      
      sandbox.stub(document, 'getElementById').callsFake(() => {
        return null;
      });

      let id = 'foo',
          error_msg = 'Element with given id '+id+' doesn\'t exist';
      expect(() => hotels.setList(id)).to.throw(Error, error_msg);
    });
    
    it('should put a list of elements as children of a given HTML element with an ID', () => {
      let parTag = 'ul',
          chTag = 'li',
          hotels = new Hotels(parTag, chTag),
          spyAppCh = sinon.spy(),
          spyCrEl = sinon.spy(document, 'createElement');
          
      sandbox.stub(hotels, 'list').value([
          {"id":"1","name":"Hotel Sunny Palms"},
          {"id":"2","name":"Hotel Snowy Mountains"},
          {"id":"3","name":"Hotel Windy Sails"},
          {"id":"4","name":"Hotel Middle of Nowhere"}
      ]);
      console.log('hotels.list.length', hotels.list.length);
      
      sandbox.stub(document, 'getElementById').callsFake((id) => {
        return {
          chTagementCount: 0,
          id: id,
          tagName: "DIV",
          nodeName: "DIV",
          innerHTML: "",
          appendChild: spyAppCh
        };
      });

      let id = 'id',
          initialNumChildren = document.getElementById(id).chTagementCount,
          finalNumChildren = 0;
      console.log('Liczba dzieci:', initialNumChildren);
      
      hotels.setList(id);
      sinon.assert.calledTwice(document.getElementById);
      sinon.assert.calledOnce(spyAppCh);
      assert(spyCrEl.withArgs(parTag).calledOnce);
      assert(spyCrEl.withArgs(chTag).callCount === hotels.list.length);
 
      finalNumChildren = document.getElementById(id).chTagementCount;
      console.log('finalNumChildren', finalNumChildren);
      expect(finalNumChildren === initialNumChildren + hotels.list.length);
    });
  });
});