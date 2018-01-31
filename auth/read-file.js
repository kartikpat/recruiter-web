module.exports = function(settings) {

    var fs = settings.fs;

    function readFile() {
        fs.readFile('facebookUrl.json', 'utf8', function (err,data) {
              if (err) {
                return console.log(err);
              }
              console.log(data);
        });
    }

}
