
var execSync = require('exec-sync');

var util = require('../public/javascripts/main_utils.js');
var config = require('../public/javascripts/config.js');

exports.render = function(req, res) {
    var sessionid = req.params.sessionid;
    var cmd = '--dotcmd ' + config.DOT_CMD + ' -c sbml.xml.params.json -M sbml.xml.mets.json sbml.xml';

    util.write_local_json(sessionid, "METDRAW_STATUS.json", {running: true, outputby: "write local"});
    console.log("finished writing status file");

    var main_run = function() {
        util.metdraw(sessionid, cmd + ' > output.txt',
            function(error, stdout, stderr) {
                console.log('finished main run');
                console.log(error);
                console.log(stderr);
                execSync(config.PREVIEW_CMD);
                util.write_local_json(sessionid, "METDRAW_STATUS.json", {running: false, outputby: "callback"});
                console.log('finished updating status file');
            });
    }

    util.metdraw(sessionid, '--norun --show ' + cmd,
                 function(error, stdout, stderr) {
                     console.log('finished pre-run');
                     res.write(stdout);
                     res.write(stderr);
                     res.end();
                     main_run();
                 });

    //util.write_local_json(sessionid, 'METDRAW_STATUS.json', {running: true});
}
