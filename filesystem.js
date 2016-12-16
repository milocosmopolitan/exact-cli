'use strict'

const path = require('path');
const fs = require("fs");
const message = require('./message');
const log = console.log;


function _exists(filepath) {
    return new Promise(resolve=>{
        fs.exists(filepath, exists=>{
            resolve(exists);
        });
    });
}

function _stat(filepath) {
    return new Promise(function (resolve, reject) {
        fs.stat(filepath, function (err, stats) {
            if (err) return reject(err);
            resolve(stats);
        });
    });
}

function _mkdir(dir, mode) {    
    message.red(`Make directory: ${dir}`, { fill: true })
    mode || (mode = 511/* 0777 */);
    return new Promise(function (resolve, reject) {
        fs.mkdir(dir, mode, function (err) {
            if (err && err.code !== "EEXIST") return reject(err);
            resolve(dir);
        });
    });
}

function readdir(filepath, callback){
    return new Promise((resolve, reject)=>{
        fs.readdir(filepath, (err, files)=>{
            err === null ? resolve(files) : reject(err)
        })
    })
}



function read(filepath, encoding, callback){
    encoding || (encoding = 'utf-8');

    return new Promise((resolve, reject)=>{
        fs.readFile(filepath, encoding, (err, data)=>{
            err === null ? resolve(data) : reject(err)
        });        
    })
}

function touch(filepath, data, options){
    return new Promise((resolve, reject)=>{
        fs.writeFile(filepath, data, options, (err) => {
            err === null ? resolve(filepath) : reject(err)
        })
    })
}

function mkdir(dir, mode) {
    var paths = dir.split(path.sep);
    if (paths[0] === "") {
        paths[0] = path.sep;
    }
    return paths.reduce((promise, fp)=>{

        return promise.then(prev=>{
            fp = path.join(prev, fp);
            return _exists(fp).then(exists=>{
                if (!exists) return _mkdir(fp, mode);

                return _stat(fp).then(stats=>{                    
                    if (stats.isDirectory()) {
                        return fp;
                    } else {
                        var err = new Error("Cannot create directory " + fp + ": Not a directory.");
                        return Promise.reject(err);
                    }
                });
            });
        });
    }, Promise.resolve(""));
};

module.exports = {
    touch: touch,
    readdir: readdir,
    mkdir: mkdir,
    read: read,
    exists: _exists
}
