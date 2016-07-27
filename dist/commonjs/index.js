'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaPal = require('./aurelia-pal');

Object.keys(_aureliaPal).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaPal[key];
    }
  });
});