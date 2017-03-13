module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      midilive: {
        src: ['build/**/*.js'],
        dest: 'latest/midilive.js',
      }
    },
    watch: {
      files: ['build/**/*.js'],
      tasks: ['browserify'],
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
