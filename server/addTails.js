import { Tail } from 'tail'
import fs from 'fs'
import path from 'path'
import readline from 'readline'

// Add a listener to each log-file
function addTail(filename, callback){
    let t = new Tail(filename);
    // Each time a new line comes in, send it along
    t.on("line", function(line){
        callback(filename, line)
    });
}

function getLogsFromFile(filename, callback){
    fs.readFile(filename, "utf-8", function (err, text) {
        if (err) {throw err};
        let lines = text.split('\n');
        callback(filename, lines);
    });
}

function getFileNames(dir, callback){
    fs.readdir(dir, function(err,files){
        if(err){ throw err; }
        const filenames = files.map((filename) => path.resolve(dir, filename));
        for (const filename of filenames){
            fs.stat(filename, (err, locationStats) => {
                if (err) throw err;
                if (locationStats.isDirectory()) {
                    getFileNames(filename, callback);
                } else {
                    callback(filename)
                }
            });
        }
    });
}

export { addTail, getFileNames, getLogsFromFile}
