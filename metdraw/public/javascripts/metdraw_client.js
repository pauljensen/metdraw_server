/**
 * Created with JetBrains WebStorm.
 * User: jensen
 * Date: 7/15/13
 * Time: 12:46 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function() {
   $('#send_minors').click(function() {

       var minors = new Array();
       $('input[class=minor]').each(function() {
           minors.push({
               name: $(this).data('name'),
               count: $(this).data('count'),
               minor: $(this).attr('checked') === 'checked'
           });
       });

       $.ajax({
           url: '/upload_json/'+$('input#sessionid').val()+'/sbml.xml.mets.json',
           type: 'POST',
           contentType: 'application/json',
           data: JSON.stringify({minor_counts: minors}),
           dataType: 'json'
       });

       var params = {};
       $("#parameters input[type=text]").each(function() {
           if ($(this).data('type') === "number") {
               params[$(this).data('name')] = parseFloat($(this).val());
           } else {
               params[$(this).data('name')] = $(this).val();
           }
       });
       $("#parameters input[type=checkbox]").each(function() {
           params[$(this).data('name')] = $(this).attr('checked') === 'checked';
       });
       $("#parameters textarea").each(function() {
           params[$(this).data('name')] = JSON.parse($(this).val());
       });

       $.ajax({
           url: '/upload_json/'+$('input#sessionid').val()+'/sbml.xml.params.json',
           type: 'POST',
           contentType: 'application/json',
           data: JSON.stringify(params),
           dataType: 'json'
       });
   });
});