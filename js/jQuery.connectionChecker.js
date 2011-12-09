(function($){
	$.fn.extend({
	
		// Plugin
		ConnectionChecker	: function( options ){
			
			var el	= $(this);
			var settings = $.extend({}, $.fn.ConnectionChecker.defaults, options);
			
			// Convert timeout in millisecond
			settings.checkEvery = settings.checkEvery * 1000;
			settings.timeout = settings.timeout * 1000;
			
			window.connectionStatus	= null;
			
			return this.each(function(){
				
				checkStatus( el, settings );
				
			});
		
		}
	
	});
	
	$.fn.ConnectionChecker.defaults = {
		url				: 'http://google.com',
		checkEvery		: 20, // Seconds
		timeout			: 10, // seconds
		playSound		: true,
		onlineSound		: 'audio/online.mp3',
		offlineSound	: 'audio/offline.mp3',
		onLine			: function(){},
		offLine			: function(){}
	};
	
	function setAsOnline( el, settings ){
		
		el.removeClass('offline').addClass('online');
		
		if( window.connectionStatus != 'online' ){
			window.connectionStatus = 'online';
			playSound( settings.onlineSound );
		}
		
		// Launch callback
		settings.onLine(el, settings);
		
		retry( el, settings );
	}
	
	function setAsOffline( el, settings ){
		
		el.removeClass('online').addClass('offline');
		
		if( window.connectionStatus != 'offline' ){
			window.connectionStatus = 'offline';
			playSound( settings.offlineSound );
		}
		
		// Launch callback
		settings.offLine(el, settings);
		
		retry( el, settings );
	}
	
	function retry( el, settings ){
		setTimeout( function(){
			checkStatus( el, settings );
		}, settings.checkEvery );
	}
	
	function playSound( sound ){
		var soundObj	= new Audio( sound );
		soundObj.play();
	}
	
	function logData( el, settings ){
		
	}
	
	function checkStatus( el, settings ){
		
		$.ajax({
			url			: settings.url,
			type		: 'get',
			data		: { 'id' : 'ping' }, // Dummy json data
			dataFilter	: function(data, type){
				console.log( data );
				console.log( type );
			},
			dataType	: 'jsonp',
			timeout		: settings.timeout,
			cache		: false,
			success		: function(){
				setAsOnline(el, settings);
			},
			error		: function( e ){
			
				if( e.status == 0 ){
					setAsOffline(el, settings);
				}else if( e.statusText == "timeout" ){
					setAsOffline(el, settings);
				} else {
					setAsOnline(el, settings);
				}
			}
		});
		
	}
	
})(jQuery);