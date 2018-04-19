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
	var recruiterID = 45058;
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
					res.cookie('recruiter-access-token', '');
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
				res.cookie('recruiter-access-token', '');
				return res.redirect('/login');
			})

		}
		else{
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

	app.get("/", isAuthenticated,function(req, res){
		res.render("dashboard", {
			title: "IIM JOBS | Dashboard",
			styles:  assetsMapper["dashboard"]["styles"][mode],
			scripts: assetsMapper["dashboard"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain:baseDomain,
			profile: req.profile,
			baseUrlJob: baseUrlJob
		});
		return
	});



	app.get("/post-job",isAuthenticated, function(req, res){
		res.render("post-job",{
			title: "IIM JOBS | Post job",
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
			title: "IIM JOBS | Edit job",
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
			profile: req.profile
		})
		return
	});

	app.get("/job/:jobID/candidates",isAuthenticated, function(req, res){
		var jobID = req.params.jobID;
		res.render("candidate-list", {
			title: "IIM JOBS | Candidates",
			styles:  assetsMapper["candidate-list"]["styles"][mode],
			scripts: assetsMapper["candidate-list"]["scripts"][mode],
			baseUrl: baseUrl,
			jobID: jobID,
			profile: req.profile
		})
		return
	})

	app.get("/job/:jobID/candidates-one",isAuthenticated, function(req, res){
		var jobID = req.params.jobID;
		res.render("candidate-list-one", {
			title: "IIM JOBS | Candidates",
			styles:  assetsMapper["candidate-list-one"]["styles"][mode],
			scripts: assetsMapper["candidate-list-one"]["scripts"][mode],
			baseUrl: baseUrl,
			jobID: jobID
		})
		return
	})

	app.get("/profile/:userID",isAuthenticated, function(req, res){
		var userID = req.params.userID;
		var jobID = req.query.jobID || null;
		res.render("view-resume",{
			title: "IIM JOBS | View Resume",
			styles:  assetsMapper["view-resume"]["styles"][mode],
			scripts: assetsMapper["view-resume"]["scripts"][mode],
			baseUrl: baseUrl,
			userID: userID,
			jobID: jobID
		})
		return
	});

	app.get("/calendar",isAuthenticated, function(req, res){
		res.render("calendar",{
			title: "IIM JOBS | Calendar",
			styles:  assetsMapper["calendar"]["styles"][mode],
			scripts: assetsMapper["calendar"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/login", function(req,res){
		console.log('.................2..................')
		if(req.cookies['recruiter-access-token']){
			console.log(req.cookies['recruiter-access-token'])
			return isAuthenticated(req, res);
		}
		res.cookie('recruiter-access-token', '');
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
		res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
		res.setHeader("Expires", "0"); // Proxies.
		res.render("landing", {
			title:"Recruiter Web - Landing Page | iimjobs.com",
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

	app.get("/view-reports",isAuthenticated, function(req, res){
		res.render("view-reports",{
			title: "IIM JOBS | View Reports",
			styles:  assetsMapper["view-reports"]["styles"][mode],
			scripts: assetsMapper["view-reports"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/:recruiterID/calendar",isAuthenticated, function(req, res){
		res.render("calendar-events",{
			title: "IIM JOBS | Calendar Events",
			styles:  assetsMapper["calendar-events"]["styles"][mode],
			scripts: assetsMapper["calendar-events"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/:recruiterID/slots/:calendarID",isAuthenticated, function(req, res){
		res.render("manage-calendar",{
			title: "IIM JOBS | Manage Calendar",
			styles:  assetsMapper["manage-calendar"]["styles"][mode],
			scripts: assetsMapper["manage-calendar"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/:recruiterID/slots",isAuthenticated, function(req, res){

		res.render("manage-calendar",{
			title: "IIM JOBS | Manage Calendar",
			styles:  assetsMapper["manage-calendar"]["styles"][mode],
			scripts: assetsMapper["manage-calendar"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/view-booked-slots",isAuthenticated, function(req, res){

		res.render("view-booked-slots",{
			title: "IIM JOBS | View Booked Slots",
			styles:  assetsMapper["view-booked-slots"]["styles"][mode],
			scripts: assetsMapper["view-booked-slots"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/myChat",isAuthenticated, function(req, res) {
		console.log(req.isNew);
		res.render("chat",{
			title: "IIM JOBS | myChat",
			styles:  assetsMapper["chat"]["styles"][mode],
			scripts: assetsMapper["chat"]["scripts"][mode],
			baseUrl: baseUrl,
			profile: req.profile
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

	app.get("/recruiter/my-profile",isAuthenticated, function(req, res){

		res.render("my-profile",{
			title: "IIM JOBS | My Profile",
			styles:  assetsMapper["my-profile"]["styles"][mode],
			scripts: assetsMapper["my-profile"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/edit-profile",isAuthenticated, function(req, res){

		res.render("edit-profile",{
			title: "IIM JOBS | Edit Profile",
			styles:  assetsMapper["edit-profile"]["styles"][mode],
			scripts: assetsMapper["edit-profile"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/profile-view",isAuthenticated, function(req, res){

		res.render("profile-view",{
			title: "IIM JOBS | Profile View",
			styles:  assetsMapper["profile-view"]["styles"][mode],
			scripts: assetsMapper["profile-view"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/export-profile",isAuthenticated, function(req, res){

		res.render("export-profile",{
			title: "IIM JOBS | Export Profile",
			styles:  assetsMapper["export-profile"]["styles"][mode],
			scripts: assetsMapper["export-profile"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/tags",isAuthenticated, function(req, res){

		res.render("tags",{
			title: "IIM JOBS | Tags",
			styles:  assetsMapper["tags"]["styles"][mode],
			scripts: assetsMapper["tags"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/filter-candidate",isAuthenticated, function(req, res){

		res.render("filter-candidate",{
			title: "IIM JOBS | Filter Candidate",
			styles:  assetsMapper["filter-candidate"]["styles"][mode],
			scripts: assetsMapper["filter-candidate"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/change-password", function(req, res){

		res.render("change-password", {
			title: "IIM JOBS | Change Password",
			styles:  assetsMapper["change-password"]["styles"][mode],
			scripts: assetsMapper["change-password"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})


	// TODO: Verify existence
	app.get("/recruiter/landing", function(req, res){

		res.render("account-activation", {
			title: "IIM JOBS | Account Activation",
			styles:  assetsMapper["account-activation"]["styles"][mode],
			scripts: assetsMapper["account-activation"]["scripts"][mode],
			baseUrl: baseUrl
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

	// app.get("/recruiter/reset", function(req, res){
	//
	// 	res.render("reset-password", {
	// 		title: "IIM JOBS | Reset Password",
	// 		styles:  assetsMapper["reset-password"]["styles"][mode],
	// 		scripts: assetsMapper["reset-password"]["scripts"][mode],
	// 		baseUrl: baseUrl
	// 	})
	// 	return
	// })

	app.get("/recruiter/pdf", function(req, res){

		res.render("pdfTest", {
			title: "IIM JOBS | Reset Password",
			styles:  assetsMapper["pdfTest"]["styles"][mode],
			scripts: assetsMapper["pdfTest"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/pdfIframe", function(req, res){

		res.render("pdfIframe", {
			title: "IIM JOBS | Reset Password",
			styles:  assetsMapper["pdfIframe"]["styles"][mode],
			scripts: assetsMapper["pdfIframe"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

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
			profile: req.profile
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
			profile: req.profile
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
			profile: req.profile
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

	app.get("/my-chat-test",isAuthenticated, function(req,res){
		res.render("my-chat", {
			title:"Recruiter Web - My Chat | iimjobs.com",
			styles:  assetsMapper["my-chat"]["styles"][mode],
			scripts: assetsMapper["my-chat"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile,
			uuid: "test"
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

	app.get("/about-us",isAuthenticated,function(req, res){
		res.render("about-us", {
			title:"Recruiter Web - about-us | iimjobs.com",
			styles:  assetsMapper["about-us"]["styles"][mode],
			scripts: assetsMapper["about-us"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/contact-us",isAuthenticated,function(req, res){
		res.render("contact-us", {
			title:"Recruiter Web - contact-us| iimjobs.com",
			styles:  assetsMapper["contact-us"]["styles"][mode],
			scripts: assetsMapper["contact-us"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/refund",isAuthenticated,function(req, res){
		res.render("refund", {
			title:"Recruiter Web - refund | iimjobs.com",
			styles:  assetsMapper["refund"]["styles"][mode],
			scripts: assetsMapper["refund"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/privacy",isAuthenticated,function(req, res){
		res.render("privacy", {
			title:"Recruiter Web - privacy | iimjobs.com",
			styles:  assetsMapper["privacy"]["styles"][mode],
			scripts: assetsMapper["privacy"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			profile: req.profile
		})
		return
	});

	app.get("/terms-condition",isAuthenticated,function(req, res){
		res.render("terms-condition", {
			title:"Recruiter Web -terms-condition | iimjobs.com",
			styles:  assetsMapper["terms-condition"]["styles"][mode],
			scripts: assetsMapper["terms-condition"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
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

	app.get("/interview-scheduler",function(req, res){
		res.render("no-calendar-setup", {
			title: "IIM JOBS | Dashboard",
			styles:  assetsMapper["no-calendar-setup"]["styles"][mode],
			scripts: assetsMapper["no-calendar-setup"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain:baseDomain,
			profile: req.profile
		});
		return
	});

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

	app.get("/",function(req, res){
		res.render("ui-test", {
			title: "IIM JOBS | Dashboard",
			styles:  assetsMapper["ui-test"]["styles"][mode],
			scripts: assetsMapper["ui-test"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain:baseDomain,
			profile: req.profile
		})
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
			title:"Recruiter Web - Candidate Profile | iimjobs.com",
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
			title:"Recruiter Web - Candidate Profile | iimjobs.com",
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
}
