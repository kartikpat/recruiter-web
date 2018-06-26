module.exports = function(settings){
  const	app=settings["app"];
  const querystring = require('querystring');
	const passport = settings["passport"];
  config = settings["config"];
  
  app.get('/auth/linkedin',function(req,res){
    var stateParam=config['social']['linkedin']['stateKey']+"?Page="+req.query["page"]+"&jobId="+req.query["jobId"]+"";
    stateParam=Buffer.from(stateParam).toString('base64') 
    passport.authorize('linkedin-auths',{
      state: stateParam 
    })(req, res);
  });

  app.get('/auth/linkedin/callback', function(req, res, next){
    const state = req.query.state;     
    var err=req.query.error_description;
    var buff = new Buffer(state, 'base64');  
    var text = buff.toString('ascii');
    var token=text.substring(0,text.indexOf("?"));
    text= text.substring(text.indexOf("?")+1);
    var param=querystring.parse(text);
    //authorisation error
    if(!(err)){
      config['social']['linkedin']['successRedirect']="/"+param['Page']+"?jobId="+param['jobId'];
    }  
    else{
      res.redirect(config['social']['linkedin']['successRedirect']="/"+param['Page']+"?error="+err);
    }
    
    if(token!= config['social']['linkedin']['stateKey'] ){
      return res.redirect(config['social']['linkedin']['failureRedirect']);
    }
    return next();
  }, passport.authorize('linkedin-auths',{
    failureRedirect: config['social']['linkedin']['failureRedirect'],
  }), function(req, res){
    return res.redirect(config['social']['linkedin']['successRedirect'])
  })

  app.get('/auth/twitter',function(req, res, next){
    var stateParam=config['social']['linkedin']['stateKey'];
    stateParam=Buffer.from(stateParam).toString('base64') 
    var cbURL=config['social']['twitter']['callbackURL']+"?state="+stateParam+""+"?Page="+req.query["page"]+"&jobId="+req.query["jobId"]+"";  
    // console.log("......................................");
    // stateParam=Buffer.from(stateParam).toString('base64') 
    passport.authorize('twitter-auths',{ 
      callbackURL:cbURL
    })(req, res, next);
  });

  app.get('/auth/twitter/callback', function(req, res, next){
    console.log(req)
    var path=req.url;
    path= path.substring(path.indexOf("?")+1);
    var param=querystring.parse(path);
    var token=param['state'].substring(0,param['state'].indexOf("?"))
    var buff = new Buffer(token, 'base64');  
    var tokenState = buff.toString('ascii');
    var page=param['state'].substring(param['state'].lastIndexOf("=")+1);
    var jobID=param['jobId'];
    
    config['social']['twitter']['successRedirect']="/"+page+"?jobId="+jobID+"";

    if(req.query.denied){  
      config['social']['twitter']['successRedirect']="/"+page+"";
      return res.redirect(config['social']['twitter']['successRedirect'])
    }

    if(tokenState!= config['social']['twitter']['stateKey'] ){
      return res.redirect(config['social']['twitter']['failureRedirect']);
    }
    return next();
  }, passport.authorize('twitter-auths', {
    failureRedirect: config['social']['twitter']['failureRedirect']
  }), function(req, res){
    return res.redirect(config['social']['twitter']['successRedirect'])
  })


// 	app.get('/auth/facebook', passport.authenticate('facebook',{ authType: 'rerequest',scope: configuration["facebook"]["scope"]}));


// app.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/?loginAttempt=success&target=fb',
//                                       failureRedirect: '/?loginAttempt=fail&target=fb' }));	

app.get('/logout', function(req, res){
  console.log('..logging out...')
  req.logout();
  res.redirect('/')
});
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
//     'https://www.googleapis.com/auth/plus.profile.emails.read'] }));

// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/?loginAttempt=fail&target=google' }),
//   function(req, res) {
//     res.redirect('/?loginAttempt=success&target=google');
// });


};