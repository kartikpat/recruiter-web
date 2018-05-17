/**
 * Error handler routes
 * @type {[type]}
 */
var assetsMapper = require("../asset-mapper.json")

module.exports = function(settings){
  var app = settings.app;
  var mode = settings.mode;
  var config = settings.config;
  var env = settings.env;
  var baseUrl = config["baseUrl"];
  var request = settings["request"];
  var baseDomain = config["baseDomain"];
  var baseDomainName = config['baseDomainName']
  var baseUrlJob = config["baseUrlJob"];
  var welcome = config["welcome"];
  var verifyAccount = config["verify"];
  const url = require('url');

  app.use(function(req, res, next){
    res.status(404);
    res.format({
      html: function () {
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
      },
      json: function () {
      res.json({ error: 'Not found' })
      },
      default: function () {
      res.type('txt').send('Not found')
      }
    })
  });
}
