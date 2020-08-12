module.exports = function(grunt) {
  const sass = require('node-sass');
  // 1. All configuration goes here 
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      sass_globbing: {
          import: {
              options: {
                  useSingleQuotes: false,
                  signature: ''
              },
              files: {
                  'src/assets/stylesheets/imports/imports.scss': ['node_modules/foundation-sites/scss/foundation.scss','src/assets/stylesheets/scss/app.scss'],
              }
          }
      },
      sass: { 
        options: {
          implementation: sass,
          sourceMap: true,
          outputStyle: 'compressed',
        },
          dist: {
            files: {
              'web/assets/stylesheets/app.min.css': 'src/assets/stylesheets/imports/imports.scss'
            }
          }
      },
      concat: {
          options: {
            stripBanners: true,
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %> */',
          },
          js: {
            src: ['node_modules/jquery/dist/jquery.js','node_modules/foundation/js/vendor/modernizr.js','node_modules/foundation-sites/dist/js/foundation.js','src/assets/scripts/app.js'],
            dest: 'src/assets/scripts/app.dist.js',
          }
      },
      uglify: {
          options: {
            mangle: false
          },
          js: {
            files: {
              'web/assets/scripts/app.min.js': ['src/assets/scripts/app.dist.js']
            }
          }
      },
      cssmin: {
        options: {
          shorthandCompacting: false,
          roundingPrecision: -1
        },
        target: {
          files: {
            'web/assets/stylesheets/components.min.css': ['node_modules/normalizecss/normalize.css','web/assets/stylesheets/fonts.css']
          }
        }
      },
      concurrent: {
          target: {
              tasks: ['watch', 'sass:dist']
          },
          options: {
              logConcurrentOutput: true
          }
      },
      critical: {
        test: {
            options: {
                base: './',
                css: [
                    'web/assets/stylesheets/app.min.css',
                    'web/assets/stylesheets/components.min.css',
                ],
                width: 1200,
                height: 900
            },
            src: 'http://brandeis.test?critical=false',
            dest: 'templates/_includes/critical.css'
        }
      },
      watch: {
          html: {
              files: ['web/*.html'],
              options: {
                livereload: true
              }
          },
          sass: {
            files: ['src/assets/stylesheets/scss/*'],
            tasks: ['sass_globbing','sass:dist'],
          },
          css: {
              files: ['src/assets/stylesheets/*.css'],
              tasks: ['cssmin'],
              options: {
                livereload: true
              }
          },
          app_css: {
              files: ['web/assets/stylesheets/app.min.css'],
              options: {
                livereload: true
              }
          },
          js: {
              files: ['src/assets/scripts/*.js'],
              tasks: ['concat:js','uglify:js'],
              options: {
                  spawn: false
              }
          },
      },
      googlefonts: {
        build: {
          options: {
            fontPath: 'web/assets/stylesheets/fonts/',
            cssFile: 'web/assets/stylesheets/fonts.css',
            httpPath: '/assets/stylesheets/fonts/',
            formats: {
              eot: true,
              ttf: true,
              woff: true,
              woff2: true,
              svg: true
            },
            fonts: [
              {
                family: 'Merriweather',
                styles: [
                  400, '400italic', 700, '700italic'
                ]
              },
              {
                family: 'Catamaran',
                styles: [
                  400, 600, 700
                ]
              }
            ]
          }
        }
      }
  });
  


  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-criticalcss');
  grunt.loadNpmTasks('grunt-inline-css');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-google-fonts');
  grunt.loadNpmTasks('grunt-sass-globbing');


  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('update-js', ['concat:js','uglify:js']);
  grunt.registerTask('update-css', ['cssmin']);

};