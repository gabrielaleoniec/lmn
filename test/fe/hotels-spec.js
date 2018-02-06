var expect = chai.expect;

describe('Hotels', () => {
	it('should exist', () => {
    expect(Hotels).to.be.a('function');
	});
  
  describe('#getList', () => {
    let hotels = new Hotels(),
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

      var requests = this.requests = [];

      this.xhr.onCreate = function (xhr) {
        requests.push(xhr);
      }.bind(this);
    });

    afterEach(function() {
      this.xhr.restore();
    });
       
    it('should fetch json with hotels from server', function(done) {
			hotels.getList(url, function(err, result) {
        let tmp = JSON.parse(hotels_list);

        expect(result).to.be.an('array');
        expect(result.length).to.equal(4);
        expect(result).to.eql(tmp);
        expect(result[0]).to.be.an('object');
        expect(result[0].name).to.equal('Hotel Sunny Palms');
        done();
      });
      
      this.requests[0].respond(200, { 'Content-Type': 'text/json' }, hotels_list);
    });
  });
});