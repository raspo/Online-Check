jQuery(document).ready(function($){

	$('#status').ConnectionChecker({
		url			: 'http://google.it',
		callback	: function( el, status ){
			el.find('h2').text(status)
		}
	});

});