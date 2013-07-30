/**
 * Created with JetBrains WebStorm.
 * User: jensen
 * Date: 7/14/13
 * Time: 4:24 PM
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');
var execSync = require('exec-sync');
var util = require('../public/javascripts/main_utils.js');

var get_session_id = function(file) {
    // TODO:  find a non-blocking way to do this
    var pieces = execSync("echo '" + file.path + file.lastModifiedDate +  "' | openssl sha1").split(" ");
    console.log(pieces[pieces.length-1]);
    return pieces[pieces.length-1];
}

exports.fileupload = function(req, res){
    // get the SHA1 of the uploaded file (salted with a timestamp?)
    var sessionid = get_session_id(req.files.sbml);

    // create the project directory
    fs.mkdirSync(util.get_session_path(sessionid));

    // move the file to that location
    fs.renameSync(req.files.sbml.path,
                  util.get_session_filename(sessionid, 'sbml.xml'));

    // TODO: generate this file with metdraw
    //util.mvFileSync('public/sbml.xml.mets.json', util.get_session_filename(sessionid,'sbml.xml.mets.json'));
    util.mvFileSync('public/metdraw_defaults.json', util.get_session_filename(sessionid,'sbml.xml.params.json'));
    util.mvFileSync('public/metdraw_defaults_syntax.json', util.get_session_filename(sessionid,'params_syntax.json'));

    util.count_mets(sessionid, function() {true;});

    //util.test_metdraw(sessionid, function(error, stdout, stderr) {
    //    //res.write(error);
    //    res.write(stdout);
    //    res.write(stderr);
    //    res.end();
    //});

    // redirect to the main metdraw page
    util.test_metdraw(sessionid, function(error, stdout, stderr) {
        res.writeHead(301, {
            'Location': 'metdraw/' + sessionid
        });
        res.end();
    });

};



