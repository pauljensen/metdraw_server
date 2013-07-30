
var fs = require('fs');
var execSync = require('exec-sync');
var util = require('../public/javascripts/main_utils.js');

exports.clone = function(req, res) {
    var old_id = req.params.sessionid;
    var new_id = execSync("echo '" + old_id + Date() + "' | openssl sha1");
    fs.mkdirSync(util.get_session_path(new_id));
    execSync("cp -R " + util.get_session_path(old_id) + '/* ' + util.get_session_path(new_id));
    res.writeHead(301, {
        'Location': '/metdraw/' + new_id
    });
    res.end();
}
