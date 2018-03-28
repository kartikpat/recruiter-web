	/*
	Entry point for the project. All the configurations and settings take place here.
	*/
	var express = require ("express"); //a minimalistic node.js framework
	var fs = require("fs"); //file system module to read/write or perform different operations on file.
	var bodyParser = require("body-parser"); //parses the body portion of an incoming HTTP request and makes it easier to extract different parts of the contained information.
	var program = require("commander"); //options generator for command line interface
	var compression = require("compression"); //compresses the request payload
	var cookieParser = require("cookie-parser"); //stores the session data on the client within a cookie
	var request = require("request"); //for making http and https requests
	const passport = require("passport");
	const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

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
	passport.use(new LinkedInStrategy({
		clientID: config['social']['linkedin']['clientId'],
		clientSecret: config['social']['linkedin']['secret'],
		callbackURL: config['social']['linkedin']['callbackURL'],
		scope: ['r_emailaddress', 'r_basicprofile']
	}, function(accessToken, refreshToken, profile, done){
		console.log(accessToken)
		console.log(profile)
		return done(null, {
			"token": accessToken,
			"profile" : profile
		})
	}));

	passport.serializeUser(function(user, cb) {
	  cb(null, user);
	});

	passport.deserializeUser(function(obj, cb) {
	  cb(null, obj);
	});

	var app = express();
	app.use(cookieParser())
	// not using cookie-session in this case
	// app.use(session({
	// 	name: 'sessID',
	// 	keys: ['key-1'],
	// 	httpOnly: false
	// }));
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(compression()); //compressing payload on every request

	app.use(passport.initialize());

	app.engine('html', require('hogan-express'));
	app.set('partials',{
		header: 'header',
		footer: 'footer',
		minifooter:'mini-footer',
		chatSidebar: 'chat-sidebar',
		welcome:'welcome-section',
		verify:'verify-account',
		modalContent:'modal',
		candidateApplyListShell:'shells/candidate-apply-list-shell',
		myJobsShell:'shells/my-jobs-shell',
		reportsShell: 'shells/reports-shell.html',
		chatSticky: 'chat-sticky'

	});
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');
	app.use("/static",express.static(__dirname+"/static"))
	app.use("/",express.static(__dirname+"/"))

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
	app.listen(port);
