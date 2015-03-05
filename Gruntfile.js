module.exports = function(grunt){

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        tag: {
            banner: '/*! <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today(\'yyyy\') %> Kaspars Bulins http://webit.lv */\n',
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg'],
                commit: false,
                push: false,
                createTag: false
            }
        },
        sass: {
            dist: {
                files: {
                    'build/site.css': 'assets/sass/main.scss' 
                }
            }
        },
        cssmin: {
            dist: {
                options: {
                    target: 'build/..'
                },
                files: {
                    'build/site.min.css': ['build/site.css']
                }
            }
        },
        copy: {
            vendors: {
                files: [
                    // Requirejs
                    {
                        src: 'bower_components/requirejs/require.js', 
                        dest: 'assets/js/vendor/require.js'
                    },
                    // React
                    {
                        src: 'bower_components/react/react.js', 
                        dest: 'assets/js/vendor/react.js'
                    },
                    // jQuery
                    {
                        src: 'bower_components/jquery/dist/jquery.min.js', 
                        dest: 'assets/js/vendor/jquery.js'
                    },
                    // jQuery map
                    {
                        src: 'bower_components/jquery/dist/jquery.min.map', 
                        dest: 'assets/js/vendor/jquery.min.map'
                    },
                    // Underscore
                    {
                        src: 'bower_components/underscore/underscore-min.js', 
                        dest: 'assets/js/vendor/underscore.js'
                    },
                    // Underscore map
                    {
                        src: 'bower_components/underscore/underscore-min.map', 
                        dest: 'assets/js/vendor/underscore-min.map'
                    },
                    // Socket.io
                    {
                        src: 'bower_components/socket.io-client/socket.io.js', 
                        dest: 'assets/js/vendor/socket.io.js'
                    },
                    // Snap.svg
                    {
                        src: 'bower_components/snap.svg/dist/snap.svg.js', 
                        dest: 'assets/js/vendor/snap.svg.js'
                    },
                    // moment
                    {
                        src: 'bower_components/moment/moment.js', 
                        dest: 'assets/js/vendor/moment.js'
                    }
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'assets/js',
                    include: 'app',
                    out: 'build/app.js',
                    wrap: true,
                    optimize: 'none',
                    onModuleBundleComplete: function (data) {
                        var fs = require('fs'),
                            amdclean = require('amdclean'),
                            outputFile = data.path;

                        fs.writeFileSync(outputFile, amdclean.clean({
                            'filePath': outputFile
                        }));
                    }
                }
            }
        },
        uglify: {
            build: {
                files: {
                    'build/app.min-<%= pkg.version %>.js': ['build/app.js'],
                },
                options: {
                    banner: '<%= tag.banner %>'
                }
            }
        },
        watch: {
            css: {
                files: 'assets/sass/*.scss',
                tasks: ['sass', 'cssmin']
            }
        }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('publish_vendors', ['copy:vendors']);
    grunt.registerTask('build', ['bump', 'requirejs', 'uglify']);
};