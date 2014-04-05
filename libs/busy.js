var debug = require('debug');
var path = require('path');
var pkg = require('../package');
var finder = require('./finder');
var langs = finder.langs();

var settings = {};
settings.langs = path.resolve(__dirname, '../langs');
settings.lang = 'zh-cn';
settings.tip = debug(pkg.name);
settings.delay = 2000;

module.exports = busy;

function clock(worker, delay) {
  return function active() {
    worker.fn(finder.ramdom(worker.tips));
    setTimeout(active, Math.random() * delay);
  }
}

function busy() {
  var workers = [];
  var lang = process.argv[2] || settings.lang;
  var langPath = path.join(settings.langs, lang);
  if (langs.indexOf(lang) === -1) return settings.tip(new Error('lang is not supported.'));

  finder.tips(langPath, function(err, tips) {
    if (err) return settings.tip(err);

    // init workers
    Object.keys(tips).forEach(function(name) {
      workers.push({
        name: name,
        fn: debug(name),
        tips: tips[name]
      });
    });

    // make workers work
    workers.forEach(function(worker) {
      clock(worker, settings.delay)();
    });

  })
}