import { Tail } from 'tail'
import fs from 'fs'
import path from 'path'
import readline from 'readline'

// Add a listener to each log-file
function addTails(logDir, callback){
    fs.readdir(logDir, function(err, files){
        if(err){
            throw err;
        }
        for (const filename of files) {
            let fullpath = path.resolve(logDir, filename);
            let t = new Tail(fullpath);
            // Each time a new line comes in, send it along
            t.on("line", function(line){
                callback(filename, line)
            });
        }
    });
}

function getLogs(logDir, callback){
    fs.readdir(logDir, function(err,files){
        if(err){ throw err; }
        for (const filename of files){
            let fullpath = path.resolve(logDir, filename);
            fs.readFile(fullpath, "utf-8", function (err, text) {
                if (err) {throw err};
                let lines = text.split('\n');
                callback(filename, lines);
            });
        }
    });
}

export { addTails,  getLogs }
