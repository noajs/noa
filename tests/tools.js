( function() {
	var app;
	module( "Tools", {
		setup: function() {
			N.registerApp( N.App() );
			app = N.getApp();
		}
	} );

	QUnit.test( "isFunction", function( assert ) {
		function A( ) { }
		var B = function() {},
			C = ( function() {} ),
			D = function foo() {},
			E = ( function() {
		  return function() {};
		} )(),
			F = new Function();
		assert.equal( N.isFunction( A ), true );
		assert.equal( N.isFunction( B ), true );
		assert.equal( N.isFunction( C ), true );
		assert.equal( N.isFunction( D ), true );
		assert.equal( N.isFunction( E ), true );
		assert.equal( N.isFunction( F ), true );
	} );

	QUnit.test( "randString", function( assert ) {
		var s1 = N.randString( 5 );
		assert.equal( s1.length, 5 );
		assert.ok( s1.match( /\w{5}/ ) );
	} );

	QUnit.test( "isObjectLiteral", function( assert ) {
		function CarTypes( name ) {
			if ( name === "Honda" ) {
				return name;
			} else {
				return "Sorry, we don't sell " + name + ".";
			}
		}
		var Sales = "Toyota",
			car1 = { manyCars: { a: "Saab", "b": "Jeep" }, 7: "Mazda" },
			car2 = { myCar: "Saturn", getCar: CarTypes( "Honda" ), special: Sales };

		assert.ok( N.isObjectLiteral( car1 ) );
		assert.ok( N.isObjectLiteral( car2 ) );
	} );

	QUnit.test( "isString", function( assert ) {
		var a = "Hello world!",
			b = "Hi there it's me";
		assert.ok( N.isString( a ) );
		assert.ok( N.isString( b ) );
		assert.ok( N.isString( 5 + "" ) );
	} );

	QUnit.test( "isEmpty", function( assert ) {
		var a = null,
			b,
			c = {},
			d = [];
		assert.ok( N.isEmpty( a ) );
		assert.ok( N.isEmpty( b ) );
		assert.ok( N.isEmpty( c ) );
		assert.ok( N.isEmpty( d ) );
	} );

	QUnit.test( "makeError", function( assert ) {
		N._makeError("testerror", "This is a test.");
		assert.ok(true);
	} );

	// QUnit.test( "urlJSON", function( assert ) {
	// 	var urlObj = N.url( "http://echo.jsontest.com/status/success/fortune/howru", N.types.JSON ),
	// 		done = assert.async();
	// 	urlObj.get( function( data ) {
	// 		assert.deepEqual( data, {
	// 			status: N.types.OK,
	// 			statuz: N.types.HAPPY,
	// 			statusCode: 200,
	// 			data: {
	// 				status: "success",
	// 				fortune: "howru"
	// 			}
	// 		} );
	// 		done();
	// 	} );
	// } );

	// QUnit.test( "urlTEXT", function( assert ) {
	// 	var urlObj = N.url( "https://raw.githubusercontent.com/google/fonts/master/AUTHORS", N.types.TEXT ),
	// 		done = assert.async();
	// 	urlObj.get( function( data ) {
	// 		assert.deepEqual( data, {
	// 			status: N.types.OK,
	// 			statuz: N.types.HAPPY,
	// 			statusCode: 200,
	// 			data: "# This is the official list of authors for copyright purposes.\n"+
	// 				"# This file is distinct from the CONTRIBUTORS files.\n"+
	// 				"# See the latter for an explanation.\n"+
	// 				"#\n"+
	// 				"# Names should be added to this file as:\n"+
	// 				"# Name or Organization <email address>\n"+
	// 				"# The email address is not required for organizations.\n\n"+
	// 				"Google Inc."
	// 		} );
	// 		done();
	// 	} );
	// } );

} )();
