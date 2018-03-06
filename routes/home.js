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
	function isAuthenticated(req, res, next) {
		//bypassing the auth for development
    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    	if (req.cookies["recruiter-access-token"]) {
			console.log(baseUrl)
			return request.get({
				url: baseUrl+"/recruiter/"+recruiterID+""
			},function(err, response, body){
				if(err){
					console.log(err);
					return res.redirect('/login');
				}
				const jsonBody = JSON.parse(body)
				if(jsonBody.status && jsonBody.status =='success'){
					req.profile = jsonBody.data;
					return next();
				}
			})
			// getRequest(baseUrl+"/recruiter/"+recruiterID+"", {}, function(res){
			// 	if(res.status && res.status =='success'){
			// 		profile = res;
			// 		return next();
			// 	}
			// });
		}
		else{
			// IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
			return res.redirect('/login');
		}
	}
	app.post("/sign-in", function(req, res){
		var email = req.body.email || null;
		var password = req.body.password || null;
		if(! ( email && password ) ){
			res.status(422).json({
				status: 'fail',
				message: 'missing parameters'
			});
			return
		}
		request.post({
		  url:     baseUrl+'/recruiter/login',
		  body:  "email="+email+"&password="+password,
		  form: {email: email, password: password }
		}, function(error, response, body){
			console.log(body)
			var jsonBody = JSON.parse(body);
		  if(jsonBody.status=="success"){
		  	var cookieValue = new Buffer.from(""+Date.now()).toString('base64');
			res.cookie("sessID", cookieValue, {overwrite: true})
			req.session.user=cookieValue;
		  }
		  res.json(jsonBody)
		});
	})
	
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
			profile: req.profile
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
			jobId: req.params.jobId
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
		res.render("landing", {
			title:"Recruiter Web - Landing Page | iimjobs.com",
			styles:  assetsMapper["landing"]["styles"][mode],
			scripts: assetsMapper["landing"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
		})
		return
	});

	app.get("/logout", function(req,res){
		req.session = null;

		res.redirect("/");

	});

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
			baseDomain: baseDomain
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
			baseUrl: baseUrl
		})
		return
	})

	app.get("/recruiter/reset", function(req, res){

		res.render("reset-password", {
			title: "IIM JOBS | Reset Password",
			styles:  assetsMapper["reset-password"]["styles"][mode],
			scripts: assetsMapper["reset-password"]["scripts"][mode],
			baseUrl: baseUrl
		})
		return
	})

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

	app.get("/candidate-apply-list/:jobID",isAuthenticated, function(req,res){
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

	app.get("/my-chat", function(req,res){
		res.render("my-chat", {
			title:"Recruiter Web - My Chat | iimjobs.com",
			styles:  assetsMapper["my-chat"]["styles"][mode],
			scripts: assetsMapper["my-chat"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain
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

	app.get("/welcome", function(req,res){
		res.render("welcome", {
			title:"Recruiter Web - Welcome Page | iimjobs.com",
			styles:  assetsMapper["welcome"]["styles"][mode],
			scripts: assetsMapper["welcome"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			welcome:welcome
		})
		return
	});

	app.get("/account-created", function(req,res){
		res.render("account-created", {
			title:"Recruiter Web - Account Created Page | iimjobs.com",
			styles:  assetsMapper["account-created"]["styles"][mode],
			scripts: assetsMapper["account-created"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			verify:verifyAccount
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

	app.get("/Interview-scheduler-updated",function(req, res){
		res.render("Interview-scheduler-updated", {
			title: "Calender | Dashboard",
			styles:  assetsMapper["Interview-scheduler-updated"]["styles"][mode],
			scripts: assetsMapper["Interview-scheduler-updated"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain:baseDomain,
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
		});
		return
	});
	app.get("/recruiter/job/:jobID/applications/:applicationID",isAuthenticated, function(req,res){
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
			jobId: req.params.jobID,
			applicationId: req.params.applicationID,
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

	app.get("/empty-view",isAuthenticated, function(req,res){
		res.render("empty-view-calendar-manage", {
			title:"Recruiter Web - Candidate Profile | iimjobs.com",
			styles:  assetsMapper["empty-view-calendar-manage"]["styles"][mode],
			scripts: assetsMapper["empty-view-calendar-manage"]["scripts"][mode],
			baseUrl: baseUrl,
			baseDomain: baseDomain,
			jobId: req.params.jobID,
			applicationId: req.params.applicationID,
			profile: req.profile
		})
		return
	});

}
