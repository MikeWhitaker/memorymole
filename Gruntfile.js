module.exports = function(grunt) {
  grunt.initConfig({
    eol: {
      to_crlf_replace: {
        options: {
          eol: 'lf',
          replace: true
        },
        files: {
          src: 'D:/data/phaser/Memorymole/app/scripts/**/*.js'
        }
      }
    }
  })

  grunt.loadNpmTasks("grunt-eol");
};
