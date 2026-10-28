'use strict';

var assert = require('node:assert/strict');
var test = require('node:test');
var tests = require('./clase_test');

// Keep the same exported tests for the browser and Node.js.
Object.keys(tests).forEach(function (name) {
  test(name, function (context, done) {
    tests[name]({ deepEqual: assert.deepEqual, done: done });
  });
});
