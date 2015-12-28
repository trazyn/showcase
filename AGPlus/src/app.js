
require.config( {

	baseUrl: "./src",

	paths: {
        ui: "../src/ui",
		util: "../src/util",
		modules: "../src/modules"
	}
} );

require( [ "ui/loader" ], function() {

    var
    container = $( "#container" ),
    loader = $( ".md-loader:first" ).loader();

    Path

    .config( {

        /** Ajax page container */
        container: container,

        after: function() {

            var scripts;

            container
            .find( "script[type='amd']" )
            .each( function() {

                var module = this.src;

                require( [ module ], function( module ) {
                    module( container.children(), loader );
                } );
            } );
        }
    } )

    .when( "#/home", {
        view: "src/modules/home/index.html"
    } )

    .when( "#/post/:name?", {
        view: "src/modules/post/index.html"
    } )

    .otherwise( "#/home" )
    .listen();
} );
