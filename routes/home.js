/***
home.js
This module contains all the view rendering.
What all is visible to the eyes comes right through here.
**/

var assetsMapper = require("../asset-mapper.json")

module.exports = function(settings){
	var app = settings.app;
	var mode = settings.mode;
	var config = settings.config;
	var env = settings.env;
	var baseUrl = config["baseUrl"];
	var request = settings["request"];
	var baseDomain = config["baseDomain"];
	var baseUrlJob = config["baseUrlJob"];
	var welcome = config["welcome"];
	var verifyAccount = config["verify"];
	if(env=="local")
		baseUrl= config["baseUrl_local"];
	else
		baseUrl = config["baseUrl"];

	function splitAbout(about) {
		return about.split('\r\n').join('\\n');
	}
	function isAuthenticated(req, res, next) {
		// bypassing the auth for development
    	// CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    	// you can do this however you want with whatever variables you set up

    	if (req.cookies["recruiter-access-token"]) {

			return request.get({
				url: baseUrl+"/recruiter",
				headers: {
					Authorization: 'Bearer '+req.cookies["recruiter-access-token"]
				}
			},function(err, response, body){
				if(err){
					res.cookie('recruiter-access-token', '',{ domain: ".iimjobs.com",  maxAge: 60000, "path": "/"});
					return res.redirect('/login');
				}
				const jsonBody = JSON.parse(body)
				if(jsonBody.status && jsonBody.status =='success'){

					req.profile = jsonBody.data;
					req.profile.about = splitAbout(req.profile.about)
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
						if(req.originalUrl == "/login") {
							return res.redirect('/')
						}
						return next()
					}
					return res.redirect('/welcome');
				}
				res.cookie('recruiter-access-token', '',{ domain: ".iimjobs.com",  maxAge: 60000, "path": "/", httpOnly: false});
				return res.redirect('/login');
			})

		}
		else{
			if(req.cookies['IIMJOBS_CK1']){
				return	res.redirect('/transition');
			}
			// IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
			if(req.originalUrl == "/login") {
				return next()
			}
			return res.redirect('/login');
		}
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
	// })

	app.get("/", isAuthenticated,function(req, res){
		res.render("dashboard", {
			title: "Recruiter Dashboard | iimjobs.com",
			styles:  assetsMapper["dashboard"]["styles"][mode],
			scripts: assetsMapper["dashboard"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain:baseDomain,
			profile: req.profile,
			baseUrlJob: baseUrlJob,
			origin: "dashboard"
		});
		return
	});

	app.get("/post-job",isAuthenticated, function(req, res){
		res.render("post-job",{
			title: "Recruiter Web - Post Job | iimjobs.com",
			action: "Post Job",
			styles:  assetsMapper["post-job"]["styles"][mode],
			scripts: assetsMapper["post-job"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			hiddenLoader:"hidden"
		})
		return
	})
	app.get("/job/:jobId/edit", isAuthenticated, function(req, res){
		res.render("post-job",{
			title: "Recruiter Web - Post Job | iimjobs.com",
			action: "Edit Job",
			styles:  assetsMapper["post-job"]["styles"][mode],
			scripts: assetsMapper["post-job"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			jobId: req.params.jobId,
			hiddenClass:"hidden"
		})
		return
	})

	app.get("/my-jobs",isAuthenticated, function(req,res){
		res.render("my-jobs", {
			title:"Recruiter Web - My Jobs | iimjobs.com",
			styles:  assetsMapper["my-jobs"]["styles"][mode],
			scripts: assetsMapper["my-jobs"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			baseUrlJob: baseUrlJob,
			profile: req.profile,
			origin: "MyJobs"
		})
		return
	});

	app.get("/login", function(req,res){
		if(req.cookies['recruiter-access-token']){
			console.log(req.cookies['recruiter-access-token'])
			return isAuthenticated(req, res);
		}
		// res.cookie('recruiter-access-token', '');
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
		res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
		res.setHeader("Expires", "0"); // Proxies.
		// res.cookie('recruiter-access-token-test', "tesmlkrnrv", { domain: ".iimjobs.com",  maxAge: 60000, "path": "/"});
		res.render("landing", {
			title:"We love recruiting | iimjobs.com",
			styles:  assetsMapper["landing"]["styles"][mode],
			scripts: assetsMapper["landing"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});

	// app.get("/logout", function(req,res){
	// 	req.session = null;
	//
	// 	res.redirect("/");
	//
	// });

	app.get("/recruiter/view-booked-slots",isAuthenticated, function(req, res){

		res.render("view-booked-slots",{
			title: "IIM JOBS | View Booked Slots",
			styles:  assetsMapper["view-booked-slots"]["styles"][mode],
			scripts: assetsMapper["view-booked-slots"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})
	app.get("/recruiter/recruiter-plan",isAuthenticated, function(req, res){

		res.render("premium-posting", {
			title: "IIM JOBS | Premium Posting",
			styles:  assetsMapper["premium-posting"]["styles"][mode],
			scripts: assetsMapper["premium-posting"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	})


	app.get("/recruiter/mass-resume-status",isAuthenticated, function(req, res){

		res.render("mass-resume", {
			title: "IIM JOBS | Mass Resume",
			styles:  assetsMapper["mass-resume"]["styles"][mode],
			scripts: assetsMapper["mass-resume"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	})

	// app.get("/recruiter/pdf", function(req, res){

	// 	res.render("pdfTest", {
	// 		title: "IIM JOBS | Reset Password",
	// 		styles:  assetsMapper["pdfTest"]["styles"][mode],
	// 		scripts: assetsMapper["pdfTest"]["scripts"][mode],
	// 		baseUrl: baseUrl
	// 	})
	// 	return
	// })

	// app.get("/recruiter/pdfIframe", function(req, res){

	// 	res.render("pdfIframe", {
	// 		title: "IIM JOBS | Reset Password",
	// 		styles:  assetsMapper["pdfIframe"]["styles"][mode],
	// 		scripts: assetsMapper["pdfIframe"]["scripts"][mode],
	// 		baseUrl: baseUrl
	// 	})
	// 	return
	// })

	app.get("/ui_components", function(req, res){

		res.render("ui_components", {
			title: "Recruiter Web - UI Components | iimjobs.com",
			styles:  assetsMapper["ui-components"]["styles"][mode],
			scripts: assetsMapper["ui-components"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	})

	app.get("/settings",isAuthenticated, function(req,res){
		res.render("settings", {
			title:"Recruiter Web - Settings | iimjobs.com",
			styles:  assetsMapper["settings"]["styles"][mode],
			scripts: assetsMapper["settings"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/recruiter/tagged-candidates",isAuthenticated, function(req,res){
		res.render("tagged-candidates", {
			title:"Recruiter Web - Tagged Candidates | iimjobs.com",
			styles:  assetsMapper["tagged-candidates"]["styles"][mode],
			scripts: assetsMapper["tagged-candidates"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			origin: "TaggedCandidates"
		})
		return
	});

	app.get("/recruiter/search",isAuthenticated, function(req,res){
		res.render("global-search", {
			title:"Recruiter Web - Global Search | iimjobs.com",
			styles:  assetsMapper["global-search"]["styles"][mode],
			scripts: assetsMapper["global-search"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/recruiter/candidates",isAuthenticated, function(req,res){
		res.render("shortlisted-candidates", {
			title:"Recruiter Web - Shortlisted Candidates | iimjobs.com",
			styles:  assetsMapper["shortlisted-candidates"]["styles"][mode],
			scripts: assetsMapper["shortlisted-candidates"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			origin: "Saved/ShorlistedCandidates"
		})
		return
	});

	app.get("/recruiter/candidates/followUps",isAuthenticated, function(req,res){
		res.render("follow-up", {
			title:"Recruiter Web - Followed Up Candidates | iimjobs.com",
			styles:  assetsMapper["follow-up"]["styles"][mode],
			scripts: assetsMapper["follow-up"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/job/:jobID/applications",isAuthenticated, function(req,res){
		// var jobId = req.params.jobId;
		res.render("candidate-apply-list", {
			title:"Recruiter Web - Candidate Apply List | iimjobs.com",
			styles:  assetsMapper["candidate-apply-list"]["styles"][mode],
			scripts: assetsMapper["candidate-apply-list"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			baseUrlJob: baseUrlJob,
			jobId: req.params.jobID,
			profile: req.profile,
			origin: "CandidateApplyList"
		})
		return
	});

	app.get("/my-chat",isAuthenticated, function(req,res){
		res.render("my-chat", {
			title:"Recruiter Web - My Chat | iimjobs.com",
			styles:  assetsMapper["my-chat"]["styles"][mode],
			scripts: assetsMapper["my-chat"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/reports",isAuthenticated, function(req,res){
		res.render("reports", {
			title:"Recruiter Web - Reports | iimjobs.com",
			styles:  assetsMapper["reports"]["styles"][mode],
			scripts: assetsMapper["reports"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/welcome",isAuthenticated, function(req,res){
		res.render("welcome", {
			title:"Recruiter Web - Welcome Page | iimjobs.com",
			styles:  assetsMapper["welcome"]["styles"][mode],
			scripts: assetsMapper["welcome"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/verify-email",isAuthenticated,function(req, res){
		res.render("verify-email", {
			title:"Recruiter Web - Welcome Page | iimjobs.com",
			styles:  assetsMapper["verify-email"]["styles"][mode],
			scripts: assetsMapper["verify-email"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
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
			profile: req.profile
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
			profile: req.profile
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
			profile: req.profile
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
			profile: req.profile
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
			profile: req.profile
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
			profile: req.profile
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
			email: email
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
			key: key
		})
		return
	});

	app.get("/admin", function(req,res){
		var email = req.query.email || "";
		var key = req.query.key || ""
		res.render("admin", {
			title:"Recruiter Web - Admin | iimjobs.com",
			styles:  assetsMapper["reset-password"]["styles"][mode],
			scripts: assetsMapper["admin"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});

	app.get("/account-verified", function(req,res){
		res.render("account-verified", {
			title:"Recruiter Web - Account Verified Page | iimjobs.com",
			styles:  assetsMapper["account-verified"]["styles"][mode],
			scripts: assetsMapper["account-verified"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
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
	app.get("/Interview-scheduler-updated",isAuthenticated,function(req, res){
		res.render("Interview-scheduler-updated", {
			title: "Calender | Dashboard",
			styles:  assetsMapper["Interview-scheduler-updated"]["styles"][mode],
			scripts: assetsMapper["Interview-scheduler-updated"]["scripts"][mode],
			hiddenLoader: "hidden",
			jobId: req.params.jobID,
			applicationId: req.params.applicationID,
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		});
		return
	});

	app.get("/calendar/:calendarId/edit",isAuthenticated,function(req, res){
		res.render("Interview-scheduler-updated", {
			title: "Calender | Dashboard",
			styles:  assetsMapper["Interview-scheduler-updated"]["styles"][mode],
			scripts: assetsMapper["Interview-scheduler-updated"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain:baseDomain,
			calendarId: req.params.calendarId,
			hiddenClass: "hidden",
			jobId: req.params.jobID,
			applicationId: req.params.applicationID,
			profile: req.profile
		});
		return
	});

	app.get("/job/:jobID/applications/:applicationID",isAuthenticated, function(req,res){
		res.render("candidate-profile", {
			title:"Recruiter Web - Candidate Profile | iimjobs.com",
			styles:  assetsMapper["candidate-profile"]["styles"][mode],
			scripts: assetsMapper["candidate-profile"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			jobId: req.params.jobID,
			applicationId: req.params.applicationID,
			profile: req.profile
		})
		return
	});

	app.get("/booked-slots",isAuthenticated, function(req,res){
		res.render("booked-slots", {
			title:"Recruiter Web - Booked Slots | iimjobs.com",
			styles:  assetsMapper["booked-slots"]["styles"][mode],
			scripts: assetsMapper["booked-slots"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/calendar-manage",isAuthenticated, function(req,res){
		res.render("calendar-manage", {
			title:"Recruiter Web - Manage Calendar | iimjobs.com",
			styles:  assetsMapper["calendar-manage"]["styles"][mode],
			scripts: assetsMapper["calendar-manage"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			jobId: req.params.jobID,
			applicationId: req.params.applicationID,
			profile: req.profile
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
			profile: req.profile
		})
		return
	});

	app.get("/forgot-password", function(req, res) {
		res.render("forgot-password", {
			title:"Forgot Password | iimjobs.com",
			styles:assetsMapper['forgot-password']['styles'][mode],
			scripts:assetsMapper['forgot-password']['scripts'][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
	});
	app.get("/connect-success", function(req, res){
		res.render("connect-success", {
			title:"Account Connected Successfully | iimjobs.com",
			baseUrl: baseUrl,
			baseDomain: baseDomain
		});
	})

	app.get("/transition",function(req, res){
		var oldCookie = req.cookies['IIMJOBS_CK1'];
		res.render("transition", {
			title:"iimjobs.com",
			styles:  assetsMapper["transition"]["styles"][mode],
			scripts: assetsMapper["transition"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			oldCookie: oldCookie
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
			profile: req.profile
		});
	});

	app.get("/job/:jobId/applications/:applicationId/action/:action",isAuthenticated, function(req, res){
		const jobId = req.params.jobId,
			applicationId = req.params.applicationId,
			action = req.params.action;
		const accessToken = req.cookies["recruiter-access-token"];
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
				console.log(error);
				return res.redirect('/test');
			}
		  	const jsonBody = body;
			if(jsonBody.status && jsonBody.status =='success'){
				if(redirectURL)
					return res.redirect(baseUrl+redirectURL);
				return res.redirect('/job/'+jobId+'/applications/'+applicationId);
			}
			else {
				return res.redirect("/error");
			}
			return res.send('notok')
		});
	})
}
