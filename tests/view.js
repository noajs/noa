( function() {
	var app;
	module( "View", {
		setup: function() {
			J.registerApp( J.App() );
			app = J.getApp();
		}
	} );

	QUnit.test( "App.addView", function( assert ) {
		var view = app.addView( "content", J.View(
			document.getElementById( "content" )
		) );
		assert.strictEqual( app.getView( "content" ), view );
	} );

	QUnit.test( "App.getView", function( assert ) {
		var view = app.addView( "content", J.View(
			document.getElementById( "content" )
		) );
		assert.strictEqual( app.getView( "content" ), view );
	} );

	QUnit.test( "App.getAllViews", function( assert ) {
		var headerView = app.addView( "header", J.View(
			document.getElementById( "header" )
		) ),
			innerView = app.addView( "inner", J.View(
			document.getElementById( "inner" )
		) ),
			footerView = app.addView( "footer", J.View(
			document.getElementById( "footer" )
		) );
		assert.deepEqual( app.getAllViews(), {
			header: headerView,
			inner: innerView,
			footer: footerView
		} );
	} );

} )();
