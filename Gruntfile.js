module.exports = function(grunt) {

// 1. Toutes les configurations vont ici:
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
        dist: {
            src: [
                'app/**/*.js'
            ],
            dest: 'AngularAirsoft.js'
        }
    }

});

// 3. Nous disons à Grunt que nous voulons utiliser ce plug-in.
grunt.loadNpmTasks('grunt-contrib-concat');

// 4. Nous disons à Grunt quoi faire lorsque nous tapons "grunt" dans la console.
grunt.registerTask('default', ['concat']);
};
