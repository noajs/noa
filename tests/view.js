( function() {
	var app;
	module( "View", {
		setup: function() {
			N.registerApp( N.App() );
			app = N.getApp();
		}
	} );

	QUnit.test( "App.addView", function( assert ) {
		var view = app.addView( "content", N.View(
			document.getElementById( "content" )
		) );
		assert.strictEqual( app.getView( "content" ), view );
	} );

	QUnit.test( "App.getView", function( assert ) {
		var view = app.addView( "content", N.View(
			document.getElementById( "content" )
		) );
		assert.strictEqual( app.getView( "content" ), view );
	} );

	QUnit.test( "App.getAllViews", function( assert ) {
		var headerView = app.addView( "header", N.View(
			document.getElementById( "header" )
		) ),
			innerView = app.addView( "inner", N.View(
			document.getElementById( "inner" )
		) ),
			footerView = app.addView( "footer", N.View(
			document.getElementById( "footer" )
		) );
		assert.deepEqual( app.getAllViews(), {
			header: headerView,
			inner: innerView,
			footer: footerView
		} );
	} );

} )();
