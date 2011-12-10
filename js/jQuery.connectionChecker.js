(function($){
		
	var methods = {
	    init : function( options ) {
		
			// Merge settings
			this.settings = $.extend({}, this.defaults, options);
			
			// Convert time in millisecond
			this.settings.checkEvery = this.settings.checkEvery * 1000;
			this.settings.timeout = this.settings.timeout * 1000;

			window.connectionStatus	= null;
			
			var self = this;
	    	
			return this.each(function(){
				
				methods.checkStatus.apply( self );

			});
	    },
		checkStatus	: function(){
			
			var el			= this,
				settings	= el.settings;

			$.ajax({
				url			: settings.url,
				type		: 'get',
				data		: { 'id' : 'ping' }, // Dummy json data
				dataFilter	: function(data, type){
					console.log( data );
					console.log( type );
					return false;
				},
				dataType	: 'jsonp',
				timeout		: settings.timeout,
				cache		: false,
				success		: function(){
					methods.setStatus.apply( el, ['online'] );
				},
				error		: function( e ){

					if( e.status == 0 ){
						methods.setStatus.apply( el, ['offline'] );
					}else if( e.statusText == "timeout" ){
						methods.setStatus.apply( el, ['offline'] );
					} else {
						methods.setStatus.apply( el, ['online'] );
					}
				}
			});

		},
		setStatus : function( status ){
			
			if( status ) {
				
				console.log(status);
				
				this.removeClass('online').removeClass('offline').addClass( status );
				
				// Launch callback
				this.settings.callback( this, status );
			
				// Check if the status has changed
				if( window.connectionStatus != status ){
					window.connectionStatus = status;
				
					if( this.settings.playSound ){
						methods.playSound.apply( this, [status] );
					}
				
				}
			
				var self = this;
			
				// check once again :)
				setTimeout( function(){
					methods.checkStatus.apply( self );
				}, self.settings.checkEvery );
			}

		},
		playSound	: function( status ){
			
			// Check browser's support
			if( document.createElement('audio').canPlayType ){
			
				var audio = this.find('#' + status + '_Sound');
			
				if( audio.length ) {
					audio.get(0).play();
				}
			
			} else {
				$.error( 'Your browser doesn\'t support HTML5 audio playback');
			}
			
		}
	    
	};

	$.fn.ConnectionChecker	= function( method ){
		// Default settings
		this.defaults = {
			url				: 'http://google.com',
			checkEvery		: 20, // Seconds
			timeout			: 10, // seconds
			playSound		: true,
			callback		: function(){}
		};
		
		// Method calling logic
	    if ( methods[method] ) {
	    	return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	    	return methods.init.apply( this, arguments );
	    } else {
	    	$.error( 'Method ' +  method + ' does not exist on jQuery.ConnectionChecker' );
	    }
	}

})(jQuery);