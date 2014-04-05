var fs = require('fs');
var path = require('path');
var langsPath = path.resolve(__dirname, '../langs');

exports.langs = langs;
exports.tips = tips;

function langs() {
  var langs = fs.readdirSync(langsPath);
  return langs.filter(function(folder) {
    var abs = path.join(dir, folder);
    var isDir = fs.statSync(abs).isDirectory();
    return isDir;
  });
}

function tips(dir, callback) {
  var results = {};
  var abs = path.join(langsPath, dir);
  if (!fs.existsSync(abs)) return callback(new Error('this lang is not exist'));

  var files = fs.readdirSync(abs).filter(function(file) {
    return fs.statSync(path.join(abs, file)).isFile();
  });

  async.each(files, readlines, function(err) {
    if (err) return callback(err);
    return callback(null, results);
  });

  function readlines(file, callback) {
    fs.readFile(path.join(abs, file), function(err, buff) {
      if (err) return callback(err);
      var str = buff.toString();
      var tips = str.split('\n');
      results[file] = tips;
      return callback(null);
    });
  }
}