/**
 * Created with JetBrains WebStorm.
 * User: jensen
 * Date: 7/15/13
 * Time: 1:30 PM
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');
var util = require('../public/javascripts/main_utils');

exports.upload_json = function(req, res) {
    var sessionid = req.params.sessionid;
    var filename = req.params.filename;
    // console.log(req.body);
    util.write_local_json(sessionid, filename, req.body);
    res.end();
};
