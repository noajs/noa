( function() {
	var events;

	module( "Event", {
		setup: function() {
			events = N.Events();
		}
	} );

	// QUnit.test( "add", function( assert ) {
	// 	var done = assert.async(),
	// 		content = document.getElementById( "content" ),
	// 		addReturn = events.add( content, "customEvent", function( e ) {
	// 			assert.strictEqual( e.type, "customEvent" );
	// 			done();
	// 		} );

	// 	assert.strictEqual( addReturn, content );
	// 	events.trigger( content, "customEvent" );
	// } );

	// QUnit.test( "trigger", function( assert ) {
	// 	var content = document.getElementById( "content" );
	// 	assert.strictEqual( events.trigger( content, "customEvent2" ), content );
	// } );

	QUnit.test( "remove", function( assert ) {
		var listener = function() {},
			content = document.getElementById( "content" ),
			removeReturn = events.remove( content, "customEvent", listener );
		events.add( content, "customEvent", listener );
		assert.strictEqual( removeReturn, content );
	} );

} )();
