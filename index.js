	/*
	Entry point for the project. All the configurations and settings take place here.
	*/
	var express = require ("express"); //a minimalistic node.js framework
	var fs = require("fs"); //file system module to read/write or perform different operations on file.
	var bodyParser = require("body-parser"); //parses the body portion of an incoming HTTP request and makes it easier to extract different parts of the contained information.
	var program = require("commander"); //options generator for command line interface
	var compression = require("compression"); //compresses the request payload
	var cookieParser = require("cookie-parser"); //stores the session data on the client within a cookie
	var session = require('cookie-session')
	var favicon = require('serve-favicon');
	var path = require('path')
	const passport = require("passport");
	const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
	const TwitterStrategy = require('passport-twitter').Strategy;

	const request = require('request');

	var mode = "prod";
	var env = "cloud";
	var staticMiddlewareOptions = {
		dotfiles: 'deny',
		etag: true,
		extensions: ['html']
	};

	program
		.version(require('./package.json')['version'])
		.option('-d, --debug', 'run in debug mode')
		.option('-l, --local', 'run in local environment')
		.option('-p, --port [value]', 'specify the port number')
		.option('-c, --config [src]', 'specify config options')
		.option('-v, --vault [src]', 'specify credentials location')
		.parse(process.argv);

		
	if((!program.port) || program.port==""){
		console.log("Please provide the port number")
		console.log("Syntax: node --port <port number>")
		return
	}

	if(program.debug)
		mode = "debug";
	if(program.local)
		env = "local";

	var port = program.port;
	var config = require(program.config);
	var vault = program.vault;

	var baseUrl = config["baseUrl"];
	if(env=="local")
		baseUrl= config["baseUrl_local"];
	else
		baseUrl = config["baseUrl"];

	const assetsVersion = "/"+config['assetsVersion'];


	passport.use('linkedin-auths', new LinkedInStrategy({
		clientID: config['social']['linkedin']['clientId'],
		clientSecret: config['social']['linkedin']['secret'],
		callbackURL: config['social']['linkedin']['callbackURL'],
		scope: ['r_emailaddress', 'r_basicprofile'],
		passReqToCallback: true
	}, async function(req, accessToken, refreshToken, params, profile, done){
		const token= req.cookies[config['cookie']];
		
		const data = {
			token: accessToken,
			refreshToken: refreshToken,
			profile: profile["_json"]
		}
		try{
			await addUserSocial('linkedin', data, token);
			return done(null, data)
		}
		catch(err){
			return done(null, false);

		}
	}));

	passport.use('twitter-auths', new TwitterStrategy({
		consumerKey: config['social']['twitter']['clientId'],
		consumerSecret: config['social']['twitter']['secret'],
		callbackURL: config['social']['twitter']['callbackURL'],
		passReqToCallback: true
	}, async function(req, accessToken, refreshToken, params, profile, done){
		const token = req.cookies[config['cookie']];
		const data = {
			token: accessToken,
			refreshToken: refreshToken,
			profile: profile["_json"]
		}
		try{
			await addUserSocial('twitter', data, token);
			return done(null, data)
		}
		catch(err){
			return done(null, false);

		}
	}))

	function addUserSocial(type, data, token){
		return new Promise(function(fulfill, reject){
			request.post({
				url: baseUrl+"/recruiter/connect/"+type,
				headers: {
					Authorization: 'Bearer '+token
				},
				body: data,
				json: true
			},function(err, response, body){
				if(err){
					return reject(err);
				}
				const jsonBody = body;
				if(jsonBody.status && jsonBody.status =='success'){
					return fulfill(1);
				}
				else
					return reject('Not authorized by application')
			})
		})
	}

	passport.serializeUser(function(user, cb) {
	  cb(null, user);
	});

	passport.deserializeUser(function(obj, cb) {
	  cb(null, obj);
	});

	var app = express();
	
	app.use(favicon(path.join(__dirname+'/static/images/favicon.ico')))
	
	app.use(cookieParser())
	// not using cookie-session in this case
	app.use(session({
		name: 'sessID',
		keys: ['key-1'],
		httpOnly: false
	}));
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(compression()); //compressing payload on every request

	app.use(passport.initialize());

	app.engine('html', require('hogan-express'));
	app.set('partials',{
		header: 'header',
		footer: 'footer',
		headerOld:'old-header',
		minifooter:'mini-footer',
		chatSidebar: 'chat-sidebar',
		welcome:'welcome-section',
		verify:'verify-account',
		modalContent:'modal',
		candidateApplyListShell:'shells/candidate-apply-list-shell',
		myJobsShell:'shells/my-jobs-shell',
		chatSticky: 'chat-sticky',
		spinner:'spinner/spinner',
		loader:'spinner/loader',
		loader2:'spinner/loader2',
		error:'error/error.html',
		reportsShell: 'shells/reports-shell',
		bookedSlotsShell: 'shells/booked-slots-shell',
		massResumeShell: 'shells/mass-resume-shell',
		dashboardShell: 'shells/dashboard-shell',
		chatSticky: 'chat-sticky'
	});
	
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');
	app.use("/"+assetsVersion+"static",express.static(__dirname+"/static"))
	app.use("/static",express.static(__dirname+"/static"));
	app.locals['assetsVersion']= assetsVersion;

	function cprint(text, level){
		if(mode=="debug")
			return console.log(text);
		if(level && level === 1)
			return console.log(text);
	}

	var settings= {
		config: config,
		app: app,
		mode: mode,
		env: env,
		cprint: cprint,
		request: request,
		passport: passport
	}

	require(__dirname+"/routes/home.js")(settings);
	require(__dirname+"/routes/social-hooks.js")(settings);
	require(__dirname+"/routes/error.js")(settings);
	app.listen(port);
