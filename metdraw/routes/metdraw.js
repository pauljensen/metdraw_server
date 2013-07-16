/**
 * Created with JetBrains WebStorm.
 * User: jensen
 * Date: 7/15/13
 * Time: 2:30 AM
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');
var util = require('../public/javascripts/main_utils.js');

exports.metdraw = function (req, res) {
    var sessionid = req.params.sessionid;
    var minors = util.read_local_json(sessionid, 'sbml.xml.mets.json');
    var syntax = util.read_local_json(sessionid, 'params_syntax.json');
    var params = util.read_local_json(sessionid, 'sbml.xml.params.json');
    res.render('metdraw', { counts: minors.minor_counts,
                            sessionid: sessionid,
                            syntax: syntax,
                            params: params });
}
