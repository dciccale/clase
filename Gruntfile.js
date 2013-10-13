'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    files: {
      lib: 'lib/clase.js',
      test: 'test/clase_test.js'
    },
    jshint: {
      lib: {
        src: ['<%= files.lib %>', 'Gruntfile.js'],
        options: {
          jshintrc: 'lib/.jshintrc'
        }
      },
      test: {
        src: ['<%= files.test %>'],
        options: {
          jshintrc: 'test/.jshintrc'
        }
      }
    },
    nodeunit: {
      tests: ['<%= files.test %>']
    },
    uglify: {
      lib: {
        options: {
          report: 'gzip'
        },
        files: {
          'lib/clase.min.js': ['<%= files.lib %>']
        }
      }
    },
    watch: {
      all: {
        files: ['<%= files.lib %>', '<%= files.test %>'],
        tasks: ['jshint', 'nodeunit']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'nodeunit']);
  grunt.registerTask('default', ['test', 'uglify']);
};
