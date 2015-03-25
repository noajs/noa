( function() {
	var app;
	module( "Tools", {
		setup: function() {
			J.registerApp( J.App() );
			app = J.getApp();
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
		assert.equal( J.isFunction( A ), true );
		assert.equal( J.isFunction( B ), true );
		assert.equal( J.isFunction( C ), true );
		assert.equal( J.isFunction( D ), true );
		assert.equal( J.isFunction( E ), true );
		assert.equal( J.isFunction( F ), true );
	} );

	QUnit.test( "randString", function( assert ) {
		var s1 = J.randString( 5 );
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

		assert.ok( J.isObjectLiteral( car1 ) );
		assert.ok( J.isObjectLiteral( car2 ) );
	} );

	QUnit.test( "isString", function( assert ) {
		var a = "Hello world!",
			b = "Hi there it's me";
		assert.ok( J.isString( a ) );
		assert.ok( J.isString( b ) );
		assert.ok( J.isString( 5 + "" ) );
	} );

	QUnit.test( "isEmpty", function( assert ) {
		var a = null,
			b,
			c = {},
			d = [];
		assert.ok( J.isEmpty( a ) );
		assert.ok( J.isEmpty( b ) );
		assert.ok( J.isEmpty( c ) );
		assert.ok( J.isEmpty( d ) );
	} );

	QUnit.test( "makeError", function( assert ) {
		J._makeError("testerror", "This is a test.");
		assert.ok(true);
	} );

	// QUnit.test( "urlJSON", function( assert ) {
	// 	var urlObj = J.url( "http://echo.jsontest.com/status/success/fortune/howru", J.types.JSON ),
	// 		done = assert.async();
	// 	urlObj.get( function( data ) {
	// 		assert.deepEqual( data, {
	// 			status: J.types.OK,
	// 			statuz: J.types.HAPPY,
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
	// 	var urlObj = J.url( "https://raw.githubusercontent.com/google/fonts/master/AUTHORS", J.types.TEXT ),
	// 		done = assert.async();
	// 	urlObj.get( function( data ) {
	// 		assert.deepEqual( data, {
	// 			status: J.types.OK,
	// 			statuz: J.types.HAPPY,
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
