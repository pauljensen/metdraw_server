/**
 * Created with JetBrains WebStorm.
 * User: jensen
 * Date: 7/15/13
 * Time: 8:19 PM
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');


var get_session_path = function(sessionid) {
    return 'public/data/' + sessionid;
};
exports.get_session_path = get_session_path;

var get_session_filename = function(sessionid, filename) {
    return get_session_path(sessionid) + '/' + filename;
};
exports.get_session_filename = get_session_filename;

exports.write_remote_json = function(sessionid, filename, json_data) {
    $.ajax({
        url: '/upload_json/' + sessionid + '/' + filename,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(json_data),
        dataType: 'json'
    })
};

exports.write_local_json = function(sessionid, filename, json_data) {
    fs.writeFileSync(get_session_filename(sessionid, filename), JSON.stringify(json_data) + '\n')
};

exports.read_local_json = function(sessionid, filename) {
    try {
        return JSON.parse(fs.readFileSync(get_session_filename(sessionid, filename)));
    } catch(e) {
        console.log('trying again...');
        return JSON.parse(fs.readFileSync(get_session_filename(sessionid, filename)));
    }
};

exports.mvFileSync = function(oldfilename,newfilename) {
    var data = fs.readFileSync(oldfilename);
    fs.writeFileSync(newfilename,data);

}