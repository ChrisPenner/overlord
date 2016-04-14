import { Tail } from 'tail'
import fs from 'fs'
import path from 'path'
import readline from 'readline'

// Add a listener to each log-file
function addTails(filenames, callback){
    for (const filename of filenames) {
        let t = new Tail(filename);
        // Each time a new line comes in, send it along
        t.on("line", function(line){
            callback(filename, line)
        });
    }
}

function getFileNames(logDir, callback){
    fs.readdir(logDir, function(err,files){
        if(err){ throw err; }
        const filenames = files.map((filename) => path.resolve(logDir, filename))
        callback(filenames);
    });
}

function getLogsFromFiles(files, callback){
    for (const filename of files){
        fs.readFile(filename, "utf-8", function (err, text) {
            if (err) {throw err};
            let lines = text.split('\n');
            callback(filename, lines);
        });
    }
}

function getLocations(locations, callback){
    for (let location of locations){
        console.log('location:', location)
        fs.stat(location, (err, locationStats) => {
            if (err) throw err;
            if (locationStats.isDirectory()) {
                getFileNames(location, callback);
            } else {
                callback(filenames);
            }
        });
    }
}

export { addTails, getLocations, getFileNames, getLogsFromFiles}
