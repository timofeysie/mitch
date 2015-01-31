module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    connect: {
        target:{
            options: {
                port: 9001,
                keepalive: true
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');

};