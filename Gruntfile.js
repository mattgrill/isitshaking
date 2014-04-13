module.exports = function (grunt) {

  grunt.initConfig({

    // WATCH
    watch: {
      js: {
        files: [
          'javascript/*.js',
          '!public/js/*.min.js',
        ],
        tasks: ['jshint','uglify:dev']
      },
      sass: {
        files: ['sass/{,**/}*.scss'],
        tasks: ['sass:dev']
      }
    },
    
    // JSHINT
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        globals: {
          jQuery: true,
          module: true,
          $: true
        }
      },
      all: [
        'javascript/*.js',
        '!javascript/*.min.js',
      ]
    },

    // UGLIFY
    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: false,
          beautify: {
            beautify: true,
            indent_level: 2
          }
        },
        files: [{
          expand: true,
          cwd: 'javascript',
          src: [
            '**/*.js',
            '!**/*.min.js', 
          ],
          dest: 'public/js/',
          ext: '.min.js'
        }]
      },
      dist: {
        options: {
          mangle: {
            except: ['jQuery', '$']
          },
          compress: true
        },
        files: [{
          expand: true,
          cwd: 'javascript',
          src: [
            '**/*.js', 
            '!**/*.min.js', 
          ],
          dest: 'public/js/',
          ext: '.min.js'
        }]
      }
    },

    // SASS
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/css/style.css': 'sass/style.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'public/css/style.css': 'sass/style.scss'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');

  grunt.registerTask('build', [
    'sass:dist',
    'uglify:dist'
  ]);

};
