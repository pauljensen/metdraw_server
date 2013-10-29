
$(document).ready(function() {
    var sessionid = $('input#sessionid').val();

    var display_run = function() {
        $('#render').attr('disabled','disabled');
        $('#results').append('Metdraw is running.');
    }

    var is_running = function(nofile) {
        nofile = (typeof nofile === "undefined") ? false : nofile;
        var running;
        $.ajax({
            url: '/data/' + sessionid + '/METDRAW_STATUS.json',
            dataType: 'json',
            async: false,
            success: function(data) {running = data.running}
        }).fail(function() {running = nofile});
        return running;
    }

    var display_results = function() {
        var loc = '/data/' + sessionid + '/sbml.xml.dot.svg';
        $('#status').html('');
        $('#results').html('<div class="alert alert-success"><h4>MetDraw completed rendering.</h4>' +
            '  You can download the map <a href="' + loc + '">here</a>.</div>');
        $('#render').removeAttr('disabled');
        $('#preview').html('<h4>Preview</h4><img src="/data/' + sessionid + '/sbml.xml.dot.png"' + 
			   'alt="No preview available.">');
    }

    var monitor = function() {
        if (is_running(true)) {
            $('#render').attr('disabled','disabled');
            $('#status').html('<div class="alert alert-block"><h4>MetDraw is running.</h4>' +
                'Last check was ' + Date() + '.' +
                '<br><p>You can return to this page later to check on your map.</p></div>');
            $('#preview').html('');
            window.setTimeout(monitor, 5000);
        } else {
            display_results();
        }
    }

    var has_run = function() {
        var has;
        $.ajax({
            url: '/data/' + sessionid + '/output.txt',
            dataType: 'text',
            async: false,
            success: function() {has = true}
        }).fail(function() {has = false});
        return has;
    }

    if (is_running()) {
        monitor();
    } else if (has_run()) {
        display_results();
    }


    var dirty = false;
    $('form :input').change(function() {
        dirty = true;
        $('#warnings').html('<div class="alert alert-block"><h4>You have changed parameters.</h4>' +
                            'Please click the above button to render your map with these new settings.</div>');
    });

    $('#render').click(function() {
        $('#warnings').html('');
        $('#send-params').html('<pre>Sending parameters...</pre>');
        $('#send-minors').html('<pre>Sending minors...</pre>');
        $('#results').html('<pre>Waiting for Metdraw output...</pre>')

        // ----------------  send minors ----------------
        var minors = new Array();
        $('input[class=minor]').each(function() {
            minors.push({
                name: $(this).data('name'),
                count: $(this).data('count'),
                minor: $(this).attr('checked') === 'checked'
            });
        });
        $.ajax({
            url: '/upload_json/'+sessionid+'/sbml.xml.mets.json',
            type: 'POST',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify({minor_counts: minors}),
            dataType: 'json'
        }).done(function() {$('#send-minors').html('<pre>Sending minors...done.</pre>')});


        // ----------------  send parameters ----------------
        var params = {};
        $("input.param:text").each(function() {
            console.log($(this).data('name'));
            if ($(this).data('type') === "number") {
                params[$(this).data('name')] = parseFloat($(this).val());
            } else {
                params[$(this).data('name')] = $(this).val();
            }
        });
        $("input.param:checkbox").each(function() {
            console.log($(this).data('name'));
            params[$(this).data('name')] = $(this).attr('checked') === 'checked';
        });
        //$("textarea").each(function() {
        //    console.log($(this).data('name'));
        //    params[$(this).data('name')] = JSON.parse($(this).val());
        //});
        $("textarea").each(function() {
            console.log($(this).data('name'));
            params[$(this).data('name')] = JSON.parse($(this).val());
        });
        $.ajax({
            url: '/upload_json/'+sessionid+'/sbml.xml.params.json',
            type: 'POST',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify(params),
            dataType: 'json'
        }).done(function() {$('#send-params').html('<pre>Sending parameters...done.</pre>')});



        $.ajax({
            url: '/render/'+sessionid,
            type: "POST",
            dataType: "text",
            success: function(data) {
                $('#results').html('<pre>'+data+'</pre>');
            }
        });

        monitor();
    });

    //$.getJSON('/metdraw_defaults.json', function(data) {
    //    $('#results').append("Found " + data.COMPARTMENT_FONTSIZE);
    //})

});
