( function() {
	var app;
	module( "App", {
		setup: function() {
			J.registerApp( J.App() );
			app = J.getApp();
		}
	} );

	QUnit.test( "add", function( assert ) {
		var done = assert.async(),
			content = document.getElementById( "content" ),
			addReturn = app.events.add( content, "customEvent", function( e ) {
				assert.strictEqual( e.type, "customEvent" );
				done();
			} );

		assert.strictEqual( addReturn, content );
		app.events.trigger( content, "customEvent" );
	} );

	QUnit.test( "trigger", function( assert ) {
		var content = document.getElementById( "content" );
		assert.strictEqual( app.events.trigger( content, "customEvent2" ), content );
	} );

	QUnit.test( "remove", function( assert ) {
		var listener = function() {},
			content = document.getElementById( "content" ),
			removeReturn = app.events.remove( content, "customEvent", listener );
		app.events.add( content, "customEvent", listener );
		assert.strictEqual( removeReturn, content );
	} );

} )();
