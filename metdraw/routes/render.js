
var util = require('../public/javascripts/main_utils.js');

exports.render = function(req, res) {
    var sessionid = req.params.sessionid;
    var cmd = '--dotcmd /usr/local/bin/dot -c sbml.xml.params.json -M sbml.xml.mets.json sbml.xml';

    util.write_local_json(sessionid, "METDRAW_STATUS.json", {running: true, outputby: "write local"});
    console.log("finished writing status file");

    util.metdraw(sessionid, '--norun --show ' + cmd,
                 function(error, stdout, stderr) {
                     console.log('finished pre-run');
                     res.write(stdout);
                     res.write(stderr);
                     res.end();
                 });

    util.metdraw(sessionid, cmd + ' > output.txt',
                 function(error, stdout, stderr) {
                     console.log('finished main run');
                     console.log(error);
                     console.log(stderr);
                     util.write_local_json(sessionid, "METDRAW_STATUS.json", {running: false, outputby: "callback"});
                     console.log('finished updating status file');
                 });

    //util.write_local_json(sessionid, 'METDRAW_STATUS.json', {running: true});
}
