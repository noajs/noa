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
			all: {
				options: {
					urls: [
						"http://localhost:<%= connect.server.options.port %>/tests/index.html?coverage=true&lcovReport"
					]
				}
			}
        },

		coveralls: {
			options: {
				force: true
			},
			all: {
				src: '.coverage-results/core.lcov',
			}
		},

        connect: {
			server: {
				options: {
					port: 8085,
					base:"."
				}
			}
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
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-qunit");
	grunt.loadNpmTasks('grunt-blanket-qunit');
	grunt.loadNpmTasks('grunt-coveralls');
	grunt.registerTask( "lint", [ "jshint", "jscs" ] );
	grunt.registerTask( "test", [ "connect","qunit" ] );
	grunt.registerTask( "dev", [ "lint", "uglify" ] );
	grunt.registerTask( "default", ["jshint", "qunit"]);

	grunt.event.on('qunit.report', function(data) {
		grunt.file.write('.coverage-results/core.lcov', data);
	});

	grunt.event.on('qunit.done', function(){
		grunt.log.ok("DONE")
	})
};
