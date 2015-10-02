System.register([], function (_export) {
  'use strict';

  var FEATURE, PLATFORM, DOM;

  _export('AggregateError', AggregateError);

  _export('initializePAL', initializePAL);

  function AggregateError(message, innerError, skipIfAlreadyAggregate) {
    if (innerError) {
      if (innerError.innerError && skipIfAlreadyAggregate) {
        return innerError;
      }

      if (innerError.stack) {
        message += '\n------------------------------------------------\ninner error: ' + innerError.stack;
      }
    }

    var e = new Error(message);
    if (innerError) {
      e.innerError = innerError;
    }

    return e;
  }

  function initializePAL(callback) {
    callback(PLATFORM, FEATURE, DOM);
  }

  return {
    setters: [],
    execute: function () {
      FEATURE = {};

      _export('FEATURE', FEATURE);

      PLATFORM = {
        noop: function noop() {},
        eachModule: function eachModule() {}
      };

      _export('PLATFORM', PLATFORM);

      PLATFORM.global = (function () {
        if (typeof self !== 'undefined') {
          return self;
        }

        if (typeof global !== 'undefined') {
          return global;
        }

        return new Function('return this')();
      })();

      DOM = {};

      _export('DOM', DOM);
    }
  };
});