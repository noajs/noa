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

	QUnit.test( "instanceMethod", function( assert ) {
		assert.strictEqual( activeBlueprint.go(), "GO" );
	} );

	QUnit.test( "staticMethod", function( assert ) {
		assert.strictEqual( ActiveBlueprint.Dance(), "Dance!" );
	} );

	QUnit.test( "instanceParam", function( assert ) {
		assert.strictEqual( activeBlueprint.speak( "Spin" ), "Spin I say" );
	} );

	QUnit.test( "staticMethodParam", function( assert ) {
		assert.strictEqual( ActiveBlueprint.Run( "Go and" ), "Go and run!" );
	} );

	QUnit.test( "get", function( assert ) {
		assert.strictEqual( activeBlueprint.get( "name" ), "John" );
		assert.strictEqual( activeBlueprint.get( "age" ), 25 );
		assert.strictEqual( activeBlueprint.get( "i" ), 0 );
	} );

	QUnit.test( "set", function( assert ) {
		activeBlueprint.set( "name", "Jeff" );
		activeBlueprint.set( "age", 30 );
		activeBlueprint.set( "i", 100 );
		assert.strictEqual( activeBlueprint.get( "name" ), "Jeff" );
		assert.strictEqual( activeBlueprint.get( "age" ), 30 );
		assert.strictEqual( activeBlueprint.get( "i" ), 0 );
	} );

	QUnit.test( "watch", function( assert ) {
		var done = assert.async();
		activeBlueprint.watcher = function( data ) {
			assert.deepEqual( data, { key:"name", val:"Jim", oldVal:"John" } );
			done();
		};
		activeBlueprint.set( "name", "Jim" );
	} );

} )();
