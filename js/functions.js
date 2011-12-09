jQuery(document).ready(function($){

	$('#status').ConnectionChecker({
		url				: 'http://google.it',
		onlineSound		: 'audio/online.m4a',
		offlineSound	: 'audio/offline.m4a'
	});

});