/**
 * =====================================================
 * Promvc legacy (v2.0.0): index.js
 * Licensed by Tatrech ent.
 * =====================================================
 */

+function ( $ )
{
	'use strict';

	/**
	 * =================================================
	 * Private
	 * =================================================
	 */

	var NAME        = 'github-pages',
		VERSION     = '2.0.0',
		DATA_KEY    = 'github.pages',
		initialised = false;

	/**
	 * =================================================
	 * Class Definition
	 * =================================================
	 */

	function App( element )
	{
		this._element = element;
	}

	// public

	App.prototype.init = function ()
	{
		if ( initialised ) {
			return;
		}

		// Code goes here...
		console.log( 'Legacy init...' );

		// register init
		initialised = true;
	};

	// static

	App._jQueryInterface = function ( config )
	{
		return this.each( function () {
			let data = $( this ).data( DATA_KEY );

			if ( ! data ) {
				data = new App( this );
				$( this ).data( DATA_KEY, data );
			}

			if ( config === 'init' ) {
				data[ config ]();
			}
		});
	};

	/**
	 * =================================================
	 * Application load
	 * =================================================
	 */

	$( function ()
	{	
		$( 'body' ).each( function () {
			const $wrapper = $( this );
			App._jQueryInterface.call( $wrapper, 'init' );
		});

	});

}( jQuery );