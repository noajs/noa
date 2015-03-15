( function() {
	var ActiveBlueprint,
		activeBlueprint;
	module( "Blueprint", {
		setup: function() {
			ActiveBlueprint = J.extends( J.Blueprint, {
				go: function() {
					return "GO";
				},

				Dance: function() {
					return "Dance!";
				},

				Run: function( word ) {
					return word + " " + "run!";
				},

				speak: function( word ) {
					return word + " " + "I say";
				}
			} );

			activeBlueprint = ActiveBlueprint( {
				name: "John",
				age: 25,
				_i: 0
			} );
		}
	} );

	test( "instanceMethod", function( assert ) {
		strictEqual( activeBlueprint.go(), "GO", 1 );
	} );

	test( "staticMethod", function( assert ) {
		strictEqual( ActiveBlueprint.Dance(), "Dance!", 1 );
	} );

	test( "instanceParam", function( assert ) {
		strictEqual( activeBlueprint.speak( "Spin" ), "Spin I say", 1 );
	} );

	test( "staticMethodParam", function( assert ) {
		strictEqual( ActiveBlueprint.Run( "Go and" ), "Go and run!", 1 );
	} );

	test( "get", function( assert ) {
		strictEqual( activeBlueprint.get( "name" ), "John", 1 );
		strictEqual( activeBlueprint.get( "age" ), 25, 1 );
		strictEqual( activeBlueprint.get( "i" ), 0, 1 );
	} );

	test( "set", function( assert ) {
		activeBlueprint.set( "name", "Jeff" )
		activeBlueprint.set( "age", 30 )
		activeBlueprint.set( "i", 100 )
		strictEqual( activeBlueprint.get( "name" ), "Jeff", 1 );
		strictEqual( activeBlueprint.get( "age" ), 30, 1 );
		strictEqual( activeBlueprint.get( "i" ), 0, 1 );
	} );

	test( "watch", function( assert ) {
		var done = assert.async();
		activeBlueprint.watcher = function( data ) {
			deepEqual( data, { key:"name", val:"Jim", oldVal:"John" }, 1 );
			done();
		}
		activeBlueprint.set( "name", "Jim" );
	} );

} )();
