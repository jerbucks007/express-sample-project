module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    jsDir: 'public/js/',
    cssDir: 'public/css/',
    minDir: 'public/build/',
    pluginsDir: 'public/',



    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n',
        banner: '(function(){\n',
        footer: '\n})();'
      },
      dist: {
        files: {
					/*****
					 * DESKTOP
					 *****/
          '<%=jsDir%>desktop/grunt/game-build.js': [
            '<%=jsDir%>desktop/resources/game.zoom.js',
            '<%=jsDir%>desktop/resources/app.socket.js',
            '<%=jsDir%>desktop/resources/app.listener.js',
            '<%=jsDir%>desktop/resources/game.translation.js',
            '<%=jsDir%>desktop/resources/game.errors.js',
            '<%=jsDir%>desktop/resources/game.timer.js',
            '<%=jsDir%>desktop/resources/game.endtimer.js',
            '<%=jsDir%>desktop/resources/game.cstanding.js',
            '<%=jsDir%>desktop/resources/game.avatar.js',
            '<%=jsDir%>desktop/resources/game.player.js',
            '<%=jsDir%>desktop/resources/game.cgeneral.js',
            '<%=jsDir%>desktop/resources/game.resources.js',
            '<%=jsDir%>desktop/resources/game.sprites.js',
            '<%=jsDir%>desktop/resources/game.roadmap.js',
            '<%=jsDir%>desktop/resources/game.cchips.js',
            '<%=jsDir%>desktop/resources/game.emoji.js',
            '<%=jsDir%>desktop/resources/game.cseat.js',
            '<%=jsDir%>desktop/resources/game.cpanel.js',
            '<%=jsDir%>desktop/resources/game.cgame.js',
            '<%=jsDir%>desktop/resources/game.sounds.js',
            '<%=jsDir%>desktop/resources/game.reports.js',
            '<%=jsDir%>desktop/resources/game.canvas-resize.js',
            '<%=jsDir%>desktop/resources/game.loading.js',
            '<%=jsDir%>desktop/resources/game.header.js',
            '<%=jsDir%>desktop/resources/app.announcement.js',
            // '<%=jsDir%>desktop/resources/main.js',
          ],

          // '<%=cssDir%>sbo/grunt/sbo-build.css': [
          //   '<%=cssDir%>sbo/resources/sbo-game-header.css',
          // ],
     //      '<%=cssDir%>desktop/grunt/build.css': [
     //        '<%=cssDir%>mobile/resources/global.css',
     //        '<%=cssDir%>mobile/resources/game.css',
     //        '<%=cssDir%>mobile/resources/header.css',
     //        '<%=cssDir%>mobile/resources/loading.css',
     //        '<%=cssDir%>desktop/resources/announcement.css',
     //      ],

     //      '<%=cssDir%>mobile/grunt/m.build.css': [
     //        '<%=cssDir%>mobile/resources/global.css',
     //        '<%=cssDir%>mobile/resources/game.css',
     //        '<%=cssDir%>mobile/resources/header.css',
     //        '<%=cssDir%>mobile/resources/loading.css',
     //        '<%=cssDir%>mobile/resources/announcement.css',
     //      ],

					// /****** 
					//  * PLUGINS
					// *******/
     //      '<%=pluginsDir%>plugins/grunt/vendor.js': [
     //        // CreateJS
     //        '<%=pluginsDir%>plugins/js/createjs.min.js',
     //        '<%=pluginsDir%>plugins/js/howler.core.min.js',
     //        '<%=pluginsDir%>plugins/js/howler.min.js',
     //        '<%=pluginsDir%>plugins/js/howler.spatial.min.js',
     //        // JQuery
     //        '<%=pluginsDir%>plugins/js/jquery.min.js',
     //        // AngularJS
     //        '<%=pluginsDir%>plugins/js/angular.min.js',
     //        '<%=pluginsDir%>plugins/js/angular-material.min.js',
     //        '<%=pluginsDir%>plugins/js/angular-animate.min.js',
     //        '<%=pluginsDir%>plugins/js/angular-sanitize.min.js',
     //        '<%=pluginsDir%>plugins/js/angular-aria.min.js',
     //        '<%=pluginsDir%>plugins/js/angular-messages.min.js',
     //        '<%=pluginsDir%>plugins/js/angular-sanitize.min.js',
     //        '<%=pluginsDir%>plugins/js/angular-touch.min.js',
     //        '<%=pluginsDir%>plugins/js/angular-translate.min.js',
     //        '<%=pluginsDir%>plugins/js/angular-translate-loader-static-files.min.js',
     //        // JQuery Scrollbar
     //        '<%=pluginsDir%>plugins/js/jquery.scrollbar.min.js',
     //      ],
        }
      },
    },
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      dist: {
        files: {
          '<%=jsDir%>desktop/grunt/game-build.annotated.js': ['<%=jsDir%>desktop/grunt/game-build.js'],
          '<%=jsDir%>global/grunt/bethistory.annotated.js': ['<%=jsDir%>global/resources/bethistory.js'],
          // '<%=pluginsDir%>plugins/grunt/vendor.concat.js' : ['<%=pluginsDir%>plugins/grunt/vendor.js'],
        }
      }
    },
    uglify: {
      options: {
        mangle: true,
        sourceMap: true,
        compress: {
          drop_console: true,
          // drop_console: false,
        }
      },
      dist: {
        files: {
          '<%=minDir%>js/game-build.min.js': ['<%=jsDir%>desktop/grunt/game-build.annotated.js'],
          '<%=minDir%>js/bethistory.min.js': ['<%=jsDir%>global/grunt/bethistory.annotated.js'],
          // '<%=minDir%>js/vendor.js': ['<%=pluginsDir%>plugins/grunt/vendor.concat.js'],
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1,
        keepSpecialComments: 0
      },
      target: {
        files: {
          // '<%=minDir%>css/build.min.css': ['<%=cssDir%>desktop/grunt/build.css'],
          // '<%=minDir%>css/m.build.min.css': ['<%=cssDir%>mobile/grunt/m.build.css'],
          // '<%=minDir%>css/bethistory.min.css': ['<%=cssDir%>global/resources/bethistory.css'],
          // '<%=minDir%>css/sbo-style.min.css': ['<%=cssDir%>sbo/grunt/sbo-build.css'],
        }
      }
    }
  });

  // Load the plugins.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-uglify-es');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['concat', 'ngAnnotate', 'uglify', 'cssmin']);
  //single task(s).
  grunt.registerTask('doConcat', ['concat']);
  grunt.registerTask('doAnnotate', ['ngAnnotate']);
  grunt.registerTask('doUglify', ['uglify']);
};