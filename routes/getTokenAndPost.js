const shareJob = require('./shareJob.js');
const getSocialToken = require('./getSocialToken.js');
const config = require('../configuration.json');

async function getTokenAndPost(recruiterId, platform, accessToken, jobId, baseUrl){
	console.log(platform)
	console.log(recruiterId)
	console.log(accessToken)
	console.log(jobId)
	console.log(baseUrl)

	const socialAccessRows = await getSocialToken(recruiterId,platform,accessToken, baseUrl);
	console.log(socialAccessRows);
	if(!socialAccessRows[platform])
		throw new Error('No token');

	const token = 	socialAccessRows[platform]['accessToken'],
	refreshToken = socialAccessRows[platform]['refreshToken'],
	consumerKey = config['social']['twitter']['clientId'],
	consumerSecret = config['social']['twitter']['secret'];
	
	switch(platform){
		case 'twitter':
			(token && refreshToken && consumerKey && consumerSecret) ? true : _throw('No token');
			break;
		case 'linkedin':
			(token) ? true : _throw('No token');
			break;
		default:
			break;
	}

	const data = {
		platform,
		token,
		refreshToken,
		consumerKey,
		consumerSecret
	}
	await shareJob( baseUrl, data, accessToken, recruiterId, jobId);
	return true;
}

module.exports = getTokenAndPost;

function _throw(m){
	throw m;
}