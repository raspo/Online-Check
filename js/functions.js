jQuery(document).ready(function($){

	$('#status').ConnectionChecker({
		callback	: function( el, status ){
			el.find('h2').text(status)
		}
	});

});