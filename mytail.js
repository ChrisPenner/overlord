'use strict';
var Tail = require('tail').Tail;
var fs = require('fs');
var path = require('path')

// Add a listener to each log-file
exports.addTails = function (logDir, callback){
    fs.readdir(logDir, function(err, files){
        if(err){
            throw err;
        }
        for (var i = 0; i < files.length; i++) {
            let filename = files[i];
            let fullpath = path.resolve(logDir, filename);
            let t = new Tail(fullpath);
            // Each time a new line comes in, send it along
            t.on("line", function(line){callback(filename, line)});
        }
    });
}
