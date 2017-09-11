// var assert = require('assert');
// var chai = require('chai');
// var expect = chai.expect;

var loadViewByData = function() {
	var id = $(this).attr('data-attribute');
	var queryString = {};
	pageNumber = 1;
	if(id=='magicsort'){
	  queryString["sortBy"] = 1;
	}
	else if(id==-1 || (id>0 && id <4)){
	  queryString["status"] = id;
	}
	queryString["pageContent"] = pageContent;
	queryString["pageNumber"] = pageNumber;
	viewByOptions.removeClass("highlight");
	$(this).addClass("highlight");
	getRequest(baseUrl+"/recruiter/"+recruiterID+"/jobs/"+334895, queryString, populateJobs)
	$('.jobs_wrapper').empty();
}

describe('Canidate-list:Filters', function() {
  describe('#indexOf()', function() {
  	beforeEach(function(){
  		fixture.base = 'views'
  		fixture.load('candidate-list.html');
  	});

    it('Filter: All should contain', function() {
      	expect([1,2,3].indexOf(4)).to.be.equal(-1);
    });
    
  });
});