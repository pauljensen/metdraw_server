/**
 * Created with JetBrains WebStorm.
 * User: jensen
 * Date: 7/15/13
 * Time: 8:19 PM
 * To change this template use File | Settings | File Templates.
 */

var fs = require('fs');
var proc = require('child_process');


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

exports.read_remote_json = function(sessionid, filename) {
    var return_data;
    $.getJSON('/data/' + sessionid + '/' + filename, function(data) {return_data = data;});
    return return_data;
}

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

exports.metdraw = function(sessionid, args, callback) {
    var cmd = 'python2 ~/Dropbox/work/metdraw/src/metdraw.py ' + args;
    proc.exec(cmd,{cwd:get_session_path(sessionid)},callback);
}

exports.count_mets = function(sessionid, callback) {
    exports.metdraw(sessionid, '--count_mets --json sbml.xml', callback);
}

exports.test_metdraw = function(sessionid, callback) {
    exports.metdraw(sessionid, '--norun --show sbml.xml', callback);
}
