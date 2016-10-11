/*
 * grunt-casperjs-plugin
 * https://github.com/rodrigocuriel/grunt-casperjs-plugin
 *
 *
 * based on Ronald lokers plugin
 * https://github.com/ronaldlokers/grunt-casperjs
 *
 * Copyright (c) 2013 Rodrigo Curiel
 * Licensed under the MIT license.
 */
 
exports.init = function(grunt) {
  var exports = {};
  
  exports.casperjs = function(filepath, options, callback) {

    var command = 'casperjs test',
        exec = require('child_process').exec;

    // Add options documented in the following web site:
    //   http://casperjs.org/testing.html
    if (options.xunit) {
      command += ' --xunit=' + options.xunit;
    }

    if (options.direct) {
      command += ' --direct';
    }

    if (options.includes) {
      command += ' --includes=';
      if (options.cwd){
        command += options.cwd;
      }
      command += options.includes.join(',');
    }

    if (options.logLevel) {
      command += ' --log-level=' + options.logLevel;
    }

    if (options.pre) {
      command += ' --pre=' + options.pre.join(',');
    }

    if (options.post) {
      command += ' --post=' + options.post.join(',');
    }

    if (options.websecurity) {
      command += ' --web-security=' + options.websecurity;
    }
    
    if (options.reportPath) {
     command += ' --xunit=' + options.reportPath;
    }

    command += " " + filepath;

    grunt.log.write("\nCommand: " + command + '\n');
    grunt.log.write('Running tests from "' + filepath + '":\n');

    function puts(error, stdout, stderr) {
      //grunt.log.write('\nRunning tests from "' + filepath + '":\n');
      grunt.log.write(stdout);

      if ( error !== null ) {
        callback(error);
      } else {
        callback();
      }
    }

    exec(command, puts);
    
  };
  
  return exports;
};
