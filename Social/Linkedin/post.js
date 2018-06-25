const request = require('request');

const baseUrl = "https://api.linkedin.com/v1/people/~";
function postOnLikedIn(token, data){
	return new Promise(function(fulfill, reject){
		request.post({
			url: baseUrl+"/shares?format=json",
			headers: {
				"Authorization": 'Bearer '+token,
				"x-li-format": 'json',
				"Content-Type": "application/json"

			},
			body: data,
			json: true
		},function(err, response, body){
			if(err){
				return reject(err);
			}
			const jsonBody = JSON.parse(body);
			if(jsonBody.status && jsonBody.status =='success'){
				return fulfill(1);
			}
			else
				return reject('Not authorized by application')
		})
	})
}
module.exports = postOnLikedIn;