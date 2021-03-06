/***
home.js
This module contains all the view rendering.
What all is visible to the eyes comes right through here.
**/

var assetsMapper = require("../asset-mapper.json");
const shareJob = require('./shareJob.js');
const getSocialToken = require('./getSocialToken')
const getTokenAndPost = require('./getTokenAndPost.js');

module.exports = function(settings){
	var app = settings.app;
	var mode = settings.mode;
	var config = settings.config;
	var env = settings.env;
	var baseUrl = config["baseUrl"];
	var baseUrl_local=config["baseUrl_local"];
	var request = settings["request"];
	var baseDomain = config["baseDomain"];
	var baseDomainName = config['baseDomainName']
	var baseUrlJob = config["baseUrlJob"];
	var welcome = config["welcome"];
	var verifyAccount = config["verify"];
	var parser = require('ua-parser-js');
	var moment = require('moment');
	const url = require('url'); // built-in utility

	if(env=="local")
		baseUrl= config["baseUrl_local"];
	else
		baseUrl = config["baseUrl"];

	function splitAbout(about) {
		return about.split('\r\n').join('\\n');
	}
	function isAuthenticated(req, res, next) {
		var ua = parser(req.headers['user-agent']);
		var initialUrl = url.parse(req.url).pathname;
		if((ua.browser.name=='IE' && (ua.browser.version=="8.0"|| ua.browser.version=="9.0") && ( initialUrl.indexOf("/calendar") <0 ))){
			return res.redirect('/not-supported')
		}
		// bypassing the auth for development
    	// CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    	// you can do this however you want with whatever variables you set up

    	if(!(req.cookies[config['oldCookie']] && req.cookies[config['oldCookie']]!='undefined')){
			return res.redirect("/login");
		}

    	res.cookie('OLDRECRUITER', '',{ "path": "/", domain: baseDomain+".com", maxAge:0});

    	if (req.cookies[config["cookie"]]) {
			return request.get({
				url: baseUrl+"/recruiter",
				headers: {
					Authorization: 'Bearer '+req.cookies[config["cookie"]]
				}
			},function(err, response, body){
				if(err){
					res.cookie(config['cookie'], '',{ "path": "/", domain: baseDomain+".com"});
					return res.redirect('/login');
				}
				const jsonBody = JSON.parse(body)
				if(jsonBody.status && jsonBody.status =='success'){
					req.profile = jsonBody.data;			
					req.profile.lastLogin=moment(req.profile.lastLogin).format('ll');	
					if(!(req.profile.img_link)){
						req.profile.img_link='/static/images/noimage.png';
					}

					req.profile.about = splitAbout(req.profile.about);
					req.profile.showSearch = (req.profile.search ==2) ? null : 1
					if(req.originalUrl == "/verify-email") {
						if(req.profile.verified && req.profile.verified == 1) {
							return res.redirect('/account-created')
						}
						return next()
					}

					if(req.originalUrl == "/welcome") {
						if(req.profile.verified && req.profile.verified == 1) {
							return res.redirect('/account-created');
						}
						return next()
					}
					if(req.profile.verified && req.profile.verified == 1) {
						// if(req.profile.jobs && req.profile.jobs > 0) {
						// 	return next()
						// }
						// return res.redirect('/dashboardview');

						if(url.parse(req.url).pathname == "/login") {
							return res.redirect('/')
						}
						return next()
					}
					return res.redirect('/welcome');
				}
				res.cookie(config['cookie'], '',{ "path": "/", domain: baseDomainName});
				return res.redirect('/login');
			})

		}
		if(req.cookies[config['oldCookie']]){
			return res.redirect('/transition?callbackUrl='+req.originalUrl);
		}
		// IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
		if(req.originalUrl == "/login") {
			return next()
		}

		return res.redirect('/login?callbackUrl='+req.originalUrl);

	}

	function isVerified(req,res,next) {
		var key = req.query.k;
		var email = req.query.e;

		return request.post({
			url: baseUrl+"/recruiter/activate",
			body: {
				key: key,
				email: email
			},
			json: true
		},function(err, response, body){
			if(err){
				return res.redirect("/login")
			}
			if(response.statusCode==200){
                return next()
			}
			else {
				return next()
			}
		})
	}

	// app.post("/test-post", function(req, res){
	// 	res.cookie('recruiter-access-token', 'testklnkl',{ domain: ".iimjobs.com",  maxAge: 60000, "path": "/", httpOnly: false});
	// 	return res.json({
	// 		status: "success"
	// 	});
	// }))

	app.get("/health-check", function(req, res){
		return res.status(200).send('');
	})
	app.get("/", isAuthenticated,function(req, res){
		if(req.profile.onboarding==1){
			res.render("dashboardview", {
				title:"Recruiter Dashboard | iimjobs.com",
				styles:  assetsMapper["dashboardview"]["styles"][mode],
				scripts: assetsMapper["dashboardview"]["scripts"][mode],
				baseUrl: baseUrl,
				baseDomain: baseDomain,
				profile: req.profile,
				oldCookie: config['oldCookie'],
				cookie: config['cookie'],
 		 		baseDomainName: baseDomainName,
				staticEndPoints: config["staticEndPoints"]
			})
			return
		}
		res.render("dashboard", {
			title: "Recruiter Dashboard | iimjobs.com",
			styles:  assetsMapper["dashboard"]["styles"][mode],
			scripts: assetsMapper["dashboard"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain:baseDomain,
			profile: req.profile,
			baseUrlJob: baseUrlJob,
			origin: "dashboard",
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName,
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		});
		return
	});

	app.get("/post-job",isAuthenticated, function(req, res){
		res.render("post-job",{
			title: "Post Job | iimjobs.com",
			action: "Post Job",
			styles:  assetsMapper["post-job"]["styles"][mode],
			scripts: assetsMapper["post-job"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			hiddenLoader:"hidden",
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	})
	app.get("/job/:jobId/edit", isAuthenticated, function(req, res){
		res.render("post-job",{
			title: " Edit Job | iimjobs.com",
			action: "Edit Job",
			styles:  assetsMapper["post-job"]["styles"][mode],
			scripts: assetsMapper["post-job"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			jobId: req.params.jobId,
			hiddenClass:"hidden",
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	})

	app.get("/jobs",isAuthenticated, function(req,res){
		res.render("my-jobs", {
			title:"My Jobs | iimjobs.com",
			styles:  assetsMapper["my-jobs"]["styles"][mode],
			scripts: assetsMapper["my-jobs"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			baseUrlJob: baseUrlJob,
			profile: req.profile,
			origin: "MyJobs",
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/login",  function(req,res){
		var ua = parser(req.headers['user-agent']);
		var initialUrl = url.parse(req.url).pathname;
		if((ua.browser.name=='IE' && (ua.browser.version=="8.0"|| ua.browser.version=="9.0") && ( initialUrl.indexOf("/calendar") <0 ))){
			return res.redirect('/not-supported')
		}
		if(req.cookies[config['oldCookie']] && req.cookies[config['oldCookie']]!='undefined'){
			return isAuthenticated(req, res);
		}
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
		res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
		res.setHeader("Expires", "0"); // Proxies.
		// res.cookie('recruiter-access-token-test', "tesmlkrnrv", { domain: ".iimjobs.com",  maxAge: 60000, "path": "/"});
		res.render("landing", {
			title:"We love recruiting | iimjobs.com",
			styles:  assetsMapper["landing"]["styles"][mode],
			scripts: assetsMapper["landing"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName,
		 staticEndPoints: config["staticEndPoints"]
		})
		return
	});

	app.get("/plans",isAuthenticated, function(req, res){

		res.render("premium-posting", {
			title: "Subscription Plan | iimjobs.com",
			styles:  assetsMapper["premium-posting"]["styles"][mode],
			scripts: assetsMapper["premium-posting"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName,
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	})

	app.get("/bulk-resume-status",isAuthenticated, function(req, res){

		res.render("mass-resume", {
			title: "Bulk Resume Download | iimjobs.com",
			styles:  assetsMapper["mass-resume"]["styles"][mode],
			scripts: assetsMapper["mass-resume"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	})

	app.get("/ui_components", function(req, res){

		res.render("ui_components", {
			title: "Recruiter Web - UI Components | iimjobs.com",
			styles:  assetsMapper["ui-components"]["styles"][mode],
			scripts: assetsMapper["ui-components"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	})

	app.get("/account-settings",isAuthenticated, function(req,res){
		res.render("settings", {
			title:"Account Settings | iimjobs.com",
			styles:  assetsMapper["settings"]["styles"][mode],
			scripts: assetsMapper["settings"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});


	app.get("/candidates/tagged",isAuthenticated, function(req,res){
		res.render("tagged-candidates", {
			title:"Tagged Candidates | iimjobs.com",
			styles:  assetsMapper["tagged-candidates"]["styles"][mode],
			scripts: assetsMapper["tagged-candidates"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			origin: "TaggedCandidates",
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/search",isAuthenticated, function(req,res){
		res.render("global-search", {
			title:"Search Applications | iimjobs.com",
			styles:  assetsMapper["global-search"]["styles"][mode],
			scripts: assetsMapper["global-search"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/candidates",isAuthenticated, function(req,res){
		res.render("shortlisted-candidates", {
			title:"Shortlisted & Saved Candidates | iimjobs.com",
			styles:  assetsMapper["shortlisted-candidates"]["styles"][mode],
			scripts: assetsMapper["shortlisted-candidates"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			origin: "Saved/ShorlistedCandidates",
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/follow-up",isAuthenticated, function(req,res){
		res.render("follow-up", {
			title:"Recruiter Web - Followed Up Candidates | iimjobs.com",
			styles:  assetsMapper["follow-up"]["styles"][mode],
			scripts: assetsMapper["follow-up"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/job/:jobID/applications",isAuthenticated, function(req,res){
		// var jobId = req.params.jobId;
		res.render("candidate-apply-list", {
			title:"Application",
			styles:  assetsMapper["candidate-apply-list"]["styles"][mode],
			scripts: assetsMapper["candidate-apply-list"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			baseUrlJob: baseUrlJob,
			jobId: req.params.jobID,
			profile: req.profile,
			origin: "CandidateApplyList",
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
			baseUrl_local:baseUrl_local,
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/job/:jobID/applications-copy",isAuthenticated, function(req,res){
		// var jobId = req.params.jobId;
		res.render("candidate-apply-list-copy", {
			title:"Application | iimjobs.com",
			styles:  assetsMapper["candidate-apply-list-copy"]["styles"][mode],
			scripts: assetsMapper["candidate-apply-list-copy"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			baseUrlJob: baseUrlJob,
			jobId: req.params.jobID,
			profile: req.profile,
			origin: "CandidateApplyList",
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
			baseUrl_local:baseUrl_local,
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/chats",isAuthenticated, function(req,res){
		res.render("my-chat", {
			title:"My Chat | iimjobs.com",
			styles:  assetsMapper["my-chat"]["styles"][mode],
			scripts: assetsMapper["my-chat"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/reports",isAuthenticated, function(req,res){
		res.render("reports", {
			title:"Reports | iimjobs.com",
			styles:  assetsMapper["reports"]["styles"][mode],
			scripts: assetsMapper["reports"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/welcome",isAuthenticated, function(req,res){
		res.render("welcome", {
			title:"Welcome to iimjobs.com",
			styles:  assetsMapper["welcome"]["styles"][mode],
			scripts: assetsMapper["welcome"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/verify-email",isAuthenticated,function(req, res){
		res.render("verify-email", {
			title:"Welcome to iimjobs.com",
			styles:  assetsMapper["verify-email"]["styles"][mode],
			scripts: assetsMapper["verify-email"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/about-us",function(req, res){
		res.render("about-us", {
			title:"Recruiter Web - about-us | iimjobs.com",
			styles:  assetsMapper["about-us"]["styles"][mode],
			scripts: assetsMapper["about-us"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			hiddenActions: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/contact-us",function(req, res){
		res.render("contact-us", {
			title:"Recruiter Web - contact-us| iimjobs.com",
			styles:  assetsMapper["contact-us"]["styles"][mode],
			scripts: assetsMapper["contact-us"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			hiddenActions: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/refund",function(req, res){
		res.render("refund", {
			title:"Recruiter Web - refund | iimjobs.com",
			styles:  assetsMapper["refund"]["styles"][mode],
			scripts: assetsMapper["refund"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			hiddenActions: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/privacy",function(req, res){
		res.render("privacy", {
			title:"Recruiter Web - privacy | iimjobs.com",
			styles:  assetsMapper["privacy"]["styles"][mode],
			scripts: assetsMapper["privacy"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			hiddenActions: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/terms-condition",function(req, res){
		res.render("terms-condition", {
			title:"Recruiter Web -terms-condition | iimjobs.com",
			styles:  assetsMapper["terms-condition"]["styles"][mode],
			scripts: assetsMapper["terms-condition"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			hiddenActions: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/error",function(req, res){
		res.render("error404", {
			title:"Recruiter Web -Error | iimjobs.com",
			styles:  assetsMapper["error404"]["styles"][mode],
			scripts: assetsMapper["error404"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			hiddenActions: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/error503",function(req, res){
		res.render("error503", {
			title:"Recruiter Web -Error503 | iimjobs.com",
			styles:  assetsMapper["error503"]["styles"][mode],
			scripts: assetsMapper["error503"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			hiddenActions: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/iescreen",function(req, res){
		res.render("ieScreen", {
			title:"Recruiter Web -ieScreen | iimjobs.com",
			styles:  assetsMapper["ieScreen"]["styles"][mode],
			scripts: assetsMapper["ieScreen"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			hiddenActions: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/account-created", isVerified, function(req,res){
		var email = req.query.email || "";
		res.render("account-created", {
			title:"Recruiter Web - Account Created Page | iimjobs.com",
			styles:  assetsMapper["account-created"]["styles"][mode],
			scripts: assetsMapper["account-created"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			verify:verifyAccount,
			email: email,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/reset-password", function(req,res){
		var email = req.query.email || "";
		var key = req.query.key || ""
		res.render("reset-password", {
			title:"Recruiter Web - Reset Password Page | iimjobs.com",
			styles:  assetsMapper["reset-password"]["styles"][mode],
			scripts: assetsMapper["reset-password"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			email: email,
			key: key,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/admin", function(req,res){
		var email = req.query.email || "";
		var key = req.query.key || "";
		res.render("admin", {
			title:"Recruiter Web - Admin | iimjobs.com",
			styles:  assetsMapper["reset-password"]["styles"][mode],
			scripts: assetsMapper["admin"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/account-verified", function(req,res){
		res.render("account-verified", {
			title:"Recruiter Web - Account Verified Page | iimjobs.com",
			styles:  assetsMapper["account-verified"]["styles"][mode],
			scripts: assetsMapper["account-verified"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	// app.get("/interview-scheduler",function(req, res){
	// 	res.render("no-calendar-setup", {
	// 		title: "IIM JOBS | Dashboard",
	// 		styles:  assetsMapper["no-calendar-setup"]["styles"][mode],
	// 		scripts: assetsMapper["no-calendar-setup"]["scripts"][mode],
	// 		baseUrl: baseUrl,
	// 		baseDomain:baseDomain,
	// 		profile: req.profile
	// 	});
	// 	return
	// });

	// TODO: replace with a more semantic url
	app.get("/calendar/create",isAuthenticated,function(req, res){
		var ua = parser(req.headers['user-agent']);
		if((ua.browser.name=='IE' && (ua.browser.version=="8.0"|| ua.browser.version=="9.0"))){
			res.render("calendarIe", {
				title: "Create Calendar | iimjobs.com",
				styles:  assetsMapper["calendarIe"]["styles"][mode],
				scripts: assetsMapper["calendarIe"]["scripts"][mode],
				hiddenLoader: "hidden",
				jobId: req.params.jobID,
				applicationId: req.params.applicationID,
				baseUrl: baseUrl,
				baseDomain: baseDomain,
				profile: req.profile,
				pubnub:"disable",
				staticEndPoints: config["staticEndPoints"],
				oldCookie: config['oldCookie'],
				cookie: config['cookie'],
 		 		baseDomainName: baseDomainName
			});
			return
		}
		res.render("Interview-scheduler-updated", {
			title: "Create Calendar | iimjobs.com",
			styles:  assetsMapper["Interview-scheduler-updated"]["styles"][mode],
			scripts: assetsMapper["Interview-scheduler-updated"]["scripts"][mode],
			hiddenLoader: "hidden",
			jobId: req.params.jobID,
			applicationId: req.params.applicationID,
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
			baseDomainName: baseDomainName
		});
		return
	});


	app.post("/recruiter/:recruiterId/job/:jobId/share", async function(req, res){
		const accessToken = req.cookies[config["cookie"]];
		const recruiterId = req.params.recruiterId,
			  jobId = req.params.jobId,
			  platform=req.body.platform;

		if(['twitter', 'linkedin'].indexOf(platform)<0)
			return res.status(422).json({
				status: 'fail',
				message: 'missing parameters'
			});

		try{
			await getTokenAndPost(recruiterId, platform, accessToken, jobId, baseUrl);
			return res.json({
				status: 'success',
				message: 'job posted successfully'
			});
		}
		catch(err){
			if(err==401){
				return res.status(401).json({
					status: 'fail',
					message: 'user not authenticated'
				});
			}
			if(err==400){
				return res.status(400).json({
					status: 'fail',
					message: 'retry'
				});
			}
			if(err==409){
				return res.status(409).json({
					status: 'fail',
					message: 'job is already posted'
				});	
			}
			return res.status(503).json({
				status: 'fail',
				message: 'service error'
			});
		};		
	});

	

	app.post("/recruiter/login/verify", function(req, res){
		const oldCookie=req.cookies[config['oldCookie']]
		const accessToken = req.cookies[config["cookie"]];
		var options = { method: 'POST',
		  url: baseUrl+"/recruiter/login/verify",
		  headers: {
			'Authorization': 'Bearer '+ accessToken,
			'Content-Type': 'application/json'
			},
			body: {
				'oldCookie': oldCookie
			},
		  json: true
		};
		request(options, function (error, response, body) {
			if (error){
				return res.json(response);
			}
			const jsonBody = body;
			if(jsonBody.status && jsonBody.status =='success'){
				return res.json(jsonBody);
			}
			else {
				return res.json(jsonBody);
			}
			return res.json(jsonBody);
		});
	});

	app.post("/recruiter/:recruiterId/calendar", function(req, res){
		const recruiterId = req.params.recruiterId,
			  calendarId = req.params.calendarId

		const accessToken = req.cookies[config["cookie"]];

		var resObj = {
			"status": "",
			"message": ""
		}

		if(!recruiterId) {
			resObj.status = "fail"
			resObj.message = "missing parameters"
			return res.json(JSON.stringify(resObj));
		}

		var options = { method: 'POST',
		  url: baseUrl+ '/recruiter/'+recruiterId+'/calendar/'+calendarId+'',
		  headers: {
			'Authorization': 'Bearer '+ accessToken,
			'Content-Type': 'application/json'
			},
			body:req.body,
		  json: true
		};
		request(options, function (error, response, body) {
			if (error){
				return res.json(response);
			}
			const jsonBody = body;
			if(jsonBody.status && jsonBody.status =='success'){
				return res.json(body);
			}
			else {
				return res.json(jsonBody);
			}
			return res.json(jsonBody);
		});
	});

	app.post("/recruiter/:recruiterId/calendar/:calendarId", function(req, res){
		const recruiterId = req.params.recruiterId,
			  calendarId = req.params.calendarId

		const accessToken = req.cookies[config["cookie"]];

		var resObj = {
			"status": "",
			"message": ""
		}

		if(!calendarId && !recruiterId) {
			resObj.status = "fail"
			resObj.message = "missing parameters"
			return res.json(JSON.stringify(resObj));
		}

		var options = { method: 'POST',
		  url: baseUrl+ '/recruiter/'+recruiterId+'/calendar/'+calendarId+'',
		  headers: {
			'Authorization': 'Bearer '+ accessToken,
			'Content-Type': 'application/json'
			},
			body:req.body,
		  json: true
		};
		request(options, function (error, response, body) {
			if (error){
				return res.json(response);
			}
			const jsonBody = body;
			if(jsonBody.status && jsonBody.status =='success'){
				return res.json(body);
			}
			else {
				return res.json(jsonBody);
			}
			return res.json(jsonBody);
		});
	})

	app.get("/recruiter/:recruiterId/calendar/:calendarId", function(req, res){
		const recruiterId = req.params.recruiterId,
			  calendarId = req.params.calendarId

		const accessToken = req.cookies[config["cookie"]];

		var resObj = {
			"status": "",
			"message": ""
		}

		if(!calendarId && !recruiterId) {
			resObj.status = "fail"
			resObj.message = "missing parameters"
			return res.send(JSON.stringify(resObj));
		}

		var options = { method: 'GET',
		  url: baseUrl+ '/recruiter/'+recruiterId+'/calendar/'+calendarId+'',
		  headers: {
			'Authorization': 'Bearer '+ accessToken,
			'Content-Type': 'application/json'
			},
		  json: true
		};
		request(options, function (error, response, body) {
			if (error){
				return res.send(response);
			}
			const jsonBody = body;
			if(jsonBody.status && jsonBody.status =='success'){
				return res.send(body);
			}
			else {
				return res.send(response);
			}
			return res.send(response);
		});
	})

	app.get("/calendar/:calendarId/edit",isAuthenticated,function(req, res){
		var parser = require('ua-parser-js');
		var ua = parser(req.headers['user-agent']);
		if((ua.browser.name=='IE' && (ua.browser.version=="8.0"|| ua.browser.version=="9.0"))){
			res.render("calendarIe", {
				title: "Edit Calendar | iimjobs.com",
				styles:  assetsMapper["calendarIe"]["styles"][mode],
				scripts: assetsMapper["calendarIe"]["scripts"][mode],
				hiddenClass: "hidden",
				calendarId: req.params.calendarId,
				baseUrl: baseUrl,
				baseDomain: baseDomain,
				profile: req.profile,
				pubnub:"disable",
				staticEndPoints: config["staticEndPoints"],
				oldCookie: config['oldCookie'],
				cookie: config['cookie'],
				baseDomainName: baseDomainName
			});
			return
		}
		res.render("Interview-scheduler-updated", {
			title: "Edit Calendar | iimjobs.com",
			styles:  assetsMapper["Interview-scheduler-updated"]["styles"][mode],
			scripts: assetsMapper["Interview-scheduler-updated"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain:baseDomain,
			calendarId: req.params.calendarId,
			hiddenClass: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
			baseDomainName: baseDomainName
		});
		return
	});

	app.get("/job/:jobID/applications/:applicationID",function(req,res, next){
		var page= req.query.page || null;
		if(page=='main')
			return res.redirect("/job/"+req.params.jobID+"/applications");
		return next()
	},isAuthenticated, function(req,res){
		res.render("candidate-profile", {
			title:"Profile - | iimjobs.com",
			styles:  assetsMapper["candidate-profile"]["styles"][mode],
			scripts: assetsMapper["candidate-profile"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			jobId: req.params.jobID,
			applicationId: req.params.applicationID,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
			baseUrl_local:baseUrl_local,
 		 	baseDomainName: baseDomainName
		})
		return
	});

	app.get("/candidate/:jobseekerId/profile",isAuthenticated, function(req,res){
		res.render("candidate", {
			title:"Profile -  | iimjobs.com",
			styles:  assetsMapper["candidate"]["styles"][mode],
			scripts: assetsMapper["candidate"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			jobId: req.params.jobID,
			applicationId: req.params.jobseekerId,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/interviews",isAuthenticated, function(req,res){
		res.render("booked-slots", {
			title:"My Interviews | iimjobs.com",
			styles:  assetsMapper["booked-slots"]["styles"][mode],
			scripts: assetsMapper["booked-slots"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/calendars",isAuthenticated, function(req,res){
		res.render("calendar-manage", {
			title:"My Calendars | iimjobs.com",
			styles:  assetsMapper["calendar-manage"]["styles"][mode],
			scripts: assetsMapper["calendar-manage"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			jobId: req.params.jobID,
			applicationId: req.params.applicationID,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	// TODO: replace with a more semantic url
	app.get("/dashboardview",isAuthenticated,function(req,res){
		res.render("dashboardview", {
			title:"Recruiter Web - Newuser| iimjobs.com",
			styles:  assetsMapper["dashboardview"]["styles"][mode],
			scripts: assetsMapper["dashboardview"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
		return
	});

	app.get("/forgot-password", function(req, res) {
		res.render("forgot-password", {
			title:"Forgot Password | iimjobs.com",
			styles:assetsMapper['forgot-password']['styles'][mode],
			scripts:assetsMapper['forgot-password']['scripts'][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		})
	});
	
	app.get("/connect-success", function(req, res){
		res.render("connect-success", {
			title:"Account Connected Successfully | iimjobs.com",
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		});
	})

	app.get("/transition",function(req, res){
		var ua = parser(req.headers['user-agent']);
		var initialUrl = url.parse(req.url).pathname;
		var oldCookieValue = req.cookies[config['oldCookie']];
		if((ua.browser.name=='IE' && (ua.browser.version=="8.0"|| ua.browser.version=="9.0"))){
			res.render("transitionIe", {
				title:"iimjobs.com",
				styles:  assetsMapper["transitionIe"]["styles"][mode],
				scripts: assetsMapper["transitionIe"]["scripts"][mode],
				baseUrl: baseUrl,
				baseDomain: baseDomain,
				staticEndPoints: config["staticEndPoints"],
				oldCookie: config['oldCookie'],
				cookie: config['cookie'],
				pubnub:"disable",
				baseDomainName: baseDomainName,
				oldCookieValue: oldCookieValue,
				jobseekerCookie: config['jobseekerCookie'],
				headerRequired: true
			});
			return
		}
		res.render("transition", {
			title:"iimjobs.com",
			styles:  assetsMapper["transition"]["styles"][mode],
			scripts: assetsMapper["transition"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		    baseDomainName: baseDomainName,
			oldCookieValue: oldCookieValue,
			jobseekerCookie: config['jobseekerCookie']

		});
	})

	app.get("/job/:jobID/details",isAuthenticated, function(req, res){
		res.render("job-details", {
			title:"Job Details | iimjobs.com",
			styles:assetsMapper['job-details']['styles'][mode],
			scripts:assetsMapper['job-details']['scripts'][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			jobId: req.params.jobID,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 baseDomainName: baseDomainName
		});
	});


	app.get("/oldHeader",isAuthenticated, function(req, res){
		res.render("old-header", {
			title:"Job Details | iimjobs.com",
			styles:assetsMapper['old-header']['styles'][mode],
			scripts:assetsMapper['old-header']['scripts'][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			jobId: req.params.jobID,
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		});
	});

	app.get("/file-not-found", function(req, res){
		return res.send('The file you requested is not present');
	})

	app.get("/job/:jobId/applications/:applicationId/action/:action",isAuthenticated, function(req, res){
		const jobId = req.params.jobId,
			applicationId = req.params.applicationId,
			action = req.params.action;
		const accessToken = req.cookies[config["cookie"]];
		const recruiterId = req.profile.id;
		var redirectURL = '';
		if([ 'shortlist', 'reject', 'save', 'view', 'download' ].indexOf(action) <0)
			return res.redirect("/error");
		if(action=='download')
			redirectURL = req.query.redirectURL;
		// return res.send(req.profile);
		var options = { method: 'POST',
		  url: baseUrl+ '/recruiter/'+recruiterId+'/job/'+jobId+'/application/'+applicationId+'/action/'+action,
		  headers: {
		  	'Authorization': 'Bearer '+ accessToken,
		    'Content-Type': 'application/json'
			},
		  json: true
		};
		request(options, function (error, response, body) {
			if (error){
				return res.redirect('/test');
			}
		  	const jsonBody = body;
			if(jsonBody.status && jsonBody.status =='success'){
				if(redirectURL)
					return res.redirect(baseUrl+redirectURL);
				return res.redirect('/job/'+jobId+'/applications/'+applicationId+"?ref=email");
			}
			else {
				return res.redirect("/error");
			}
			return res.send('notok')
		});
	});
	app.get("/not-supported", function(req, res){
		res.render("redirectForIE",{
			title:"Recruiter Web | iimjobs.com",
			styles:  assetsMapper["redirectForIE"]["styles"][mode],
			scripts: assetsMapper["redirectForIE"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			hiddenActions: "hidden",
			profile: req.profile,
			staticEndPoints: config["staticEndPoints"],
			oldCookie: config['oldCookie'],
			cookie: config['cookie'],
 		 	baseDomainName: baseDomainName
		})
	})
}
