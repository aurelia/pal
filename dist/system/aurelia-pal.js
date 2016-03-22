'use strict';

System.register([], function (_export, _context) {
  var FEATURE, PLATFORM, DOM;
  return {
    setters: [],
    execute: function () {
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

      _export('AggregateError', AggregateError);

      _export('FEATURE', FEATURE = {});

      _export('FEATURE', FEATURE);

      _export('PLATFORM', PLATFORM = {
        noop: function noop() {},
        eachModule: function eachModule() {}
      });

      _export('PLATFORM', PLATFORM);

      PLATFORM.global = function () {
        if (typeof self !== 'undefined') {
          return self;
        }

        if (typeof global !== 'undefined') {
          return global;
        }

        return new Function('return this')();
      }();

      _export('DOM', DOM = {});

      _export('DOM', DOM);

      function initializePAL(callback) {
        if (typeof Object.getPropertyDescriptor !== 'function') {
          Object.getPropertyDescriptor = function (subject, name) {
            var pd = Object.getOwnPropertyDescriptor(subject, name);
            var proto = Object.getPrototypeOf(subject);
            while (typeof pd === 'undefined' && proto !== null) {
              pd = Object.getOwnPropertyDescriptor(proto, name);
              proto = Object.getPrototypeOf(proto);
            }
            return pd;
          };
        }

        callback(PLATFORM, FEATURE, DOM);
      }

      _export('initializePAL', initializePAL);
    }
  };
});