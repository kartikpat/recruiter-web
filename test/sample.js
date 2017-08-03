// var assert = require('assert');
// var chai = require('chai');
//var expect = chai.expect;

describe('Array', function() {
  describe('#indexOf()', function() {
  	beforeEach(function(){
  		fixture.base = 'views'
  		fixture.load('sign-in.html');
  	})
    it('should return -1 when the value is not present', function() {
      	expect([1,2,3].indexOf(4)).to.be.equal(-1);
    });
  });
});