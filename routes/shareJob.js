const request = require('request');
const config = require('../configuration.json');

function shareJob(baseUrl, data, accessToken, recruiterId, jobId){
	const token = data.token || null,
		refreshToken = data.refreshToken || null,
		consumerKey = data.consumerKey || null,
		consumerSecret = data.consumerSecret || null,
		platform = data.platform || null;

	var options = { method: 'POST',
	  url: baseUrl+ '/recruiter/'+recruiterId+'/job/'+jobId+'/share',
	  headers: {
		'Authorization': 'Bearer '+ accessToken,
		'Content-Type': 'application/json'
		},
		body:{
			token,
			refreshToken,
			consumerSecret,
			consumerKey,
			platform
		},
	  json: true
	};

	return new Promise(function(resolve, reject){
		request(options, function (error, response, body) {
			if (error){
				return reject(error);
			}
			const jsonBody = body;
			console.log(jsonBody)
			if(response.status ==200){
				return resolve(response.statusCode);
			}
			console.log(body);
			return reject(response.statusCode);
		});
	});
}

module.exports = shareJob;