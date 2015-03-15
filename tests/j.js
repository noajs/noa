( function() {
	var obj = {};
	module( "J", {
		setup: function() {
			obj = { a:1, b:2 };
		}
	} );

	test( "J.types", function( assert ) {
		assert.equal( J.types.URL, "URL", "J URL type is OK" );
		assert.equal( J.types.HTML, "HTML", "J HTML type is OK" );
		assert.equal( J.types.SAD, ":-(", "J SAD type is OK" );
		assert.equal( J.types.HAPPY, ":-)", "J HAPPY type is OK" );
		assert.equal( J.types.OK, "OK", "J OK type is OK" );
		assert.equal( J.types.NO_GOOD, "NO GOOD", "J NO GOOD type is OK" );
	} );

} )();
