( function() {
	var obj = {};
	module( "J", {
		setup: function() {
			obj = { a:1, b:2 };
		}
	} );

	test( "N.types", function( assert ) {
		assert.equal( N.types.URL, "URL", "J URL type is OK" );
		assert.equal( N.types.HTML, "HTML", "J HTML type is OK" );
		assert.equal( N.types.SAD, ":-(", "J SAD type is OK" );
		assert.equal( N.types.HAPPY, ":-)", "J HAPPY type is OK" );
		assert.equal( N.types.OK, "OK", "J OK type is OK" );
		assert.equal( N.types.NO_GOOD, "NO GOOD", "J NO GOOD type is OK" );
	} );

} )();
