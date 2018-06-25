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

  app.get('/auth/twitter',function(req, res){
    console.log("i am here");
    var stateParam=config['social']['twitter']['stateKey']+"?Page="+req.query["page"]+"&jobId="+req.query["jobId"]+"";
    console.log(stateParam);
    console.log("......................................");
    stateParam=Buffer.from(stateParam).toString('base64') 
    passport.authorize('twitter-auths',{
      state: stateParam 
    })(req, res);
  });



  app.get('/auth/twitter/callback', function(req, res, next){
    const state = req.query.state;
    console.log(state)
    var err=req.query.error_description;
    var buff = new Buffer(state, 'base64');  
    var text = buff.toString('ascii');
    var token=text.substring(0,text.indexOf("?"));
    text= text.substring(text.indexOf("?")+1);
    var param=querystring.parse(text);
    
    console.log(req)
    
    if(!(err)){
      config['social']['twitter']['successRedirect']="/"+param['Page']+"?jobId="+param['jobId'];
    }  
    else{
      res.redirect(config['social']['twitter']['successRedirect']="/"+param['Page']+"?error="+err);
    }
    if(token!= config['social']['twitter']['stateKey'] ){
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