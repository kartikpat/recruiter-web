const request = require('request');
const config = require('../configuration.json');
function getSocialToken(recruiterId,platform,accessToken, baseUrl){			
	return new Promise(function(fulfill, reject){
		request.get({
			url: baseUrl+ '/recruiter/'+recruiterId+'/social?platform='+platform+'',
			headers: {
			  'Authorization': 'Bearer '+ accessToken,
			  'Content-Type': 'application/json'
			  },
			json: true
		},function(err,res,body){
			if(err){
				return reject(err);
			}
			const jsonBody = body;
			if(jsonBody.status && jsonBody.status =='success'){
				return fulfill(jsonBody.data);
			}
			else
				return reject('Not authorized by application')
		})
	})
}

module.exports = getSocialToken;