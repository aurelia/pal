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

  function initializePAL(platform, feature, dom) {
    Object.assign(PLATFORM, platform);
    Object.assign(FEATURE, feature);
    Object.assign(DOM, dom);
  }

  return {
    setters: [],
    execute: function () {
      FEATURE = {};

      _export('FEATURE', FEATURE);

      PLATFORM = {
        noop: function noop() {}
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