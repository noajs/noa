module.exports = function( grunt ) {
	"use strict";

	function readOptionalJSON( filepath ) {
		var data = {};
		try {
			data = grunt.file.readJSON( filepath );
		} catch ( e ) {}
		return data;
	}

	var srcHintOptions = readOptionalJSON( "src/.jshintrc" );

	// The concatenated file won't pass onevar
	// But our modules can
	delete srcHintOptions.onevar;

	grunt.initConfig( {

		blanket_qunit: {
			all: {
				options: {
					urls: ['tests/index.html?coverage=true&gruntReport'],
					threshold: 20
				}
			}
		},

		qunit: {
            files: ["tests/index.html"]
        },

		jshint: {
			all: {
				src: [
					"src/*.js", "Gruntfile.js", "test/**/*.js"
				],
				options: {
					jshintrc: true
				}
			},
			dist: {
				src: "dist/noa.js",
				options: srcHintOptions
			}
		},
		jscs: {
			src: "src/**/*.js",
			gruntfile: "Gruntfile.js",

			// Right now, check only test helpers
			test: [ "test/data/testrunner.js" ],
			release: [ "build/*.js", "!build/release-notes.js" ],
			tasks: "build/tasks/*.js"
		},
		watch: {
			files: [ "<%= jshint.all.src %>" ],
			tasks: [ "dev" ]
		},
		uglify: {
			all: {
				files: {
					"dist/noa.min.js": [ "dist/noa.js" ]
				},
				options: {
					preserveComments: false,
					sourceMap: true,
					sourceMapName: "dist/noa.min.map",
					report: "min",
					beautify: {
						"ascii_only": true
					},
					banner: "/*! noa v<%= pkg.version %> | " +
						"(c) noajs | noajs.org/license */",
					compress: {
						"hoist_funs": false,
						loops: false,
						unused: false
					}
				}
			}
		}
	} );

	// Load grunt tasks from NPM packages
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks('grunt-blanket-qunit');
	grunt.registerTask( "lint", [ "jshint", "jscs" ] );
	grunt.registerTask( "test", [ "blanket_qunit" ] );
	grunt.registerTask( "dev", [ "lint", "uglify" ] );
	grunt.registerTask( "default", ["jshint", "qunit"]);
};
