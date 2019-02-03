'use strict';

System.register([], function (_export, _context) {
  "use strict";

  var FEATURE, PLATFORM, DOM, isInitialized;
  function AggregateError(message, innerError, skipIfAlreadyAggregate) {
    if (innerError) {
      if (innerError.innerError && skipIfAlreadyAggregate) {
        return innerError;
      }

      var separator = '\n------------------------------------------------\n';

      message += separator + 'Inner Error:\n';

      if (typeof innerError === 'string') {
        message += 'Message: ' + innerError;
      } else {
        if (innerError.message) {
          message += 'Message: ' + innerError.message;
        } else {
          message += 'Unknown Inner Error Type. Displaying Inner Error as JSON:\n ' + JSON.stringify(innerError, null, '  ');
        }

        if (innerError.stack) {
          message += '\nInner Error Stack:\n' + innerError.stack;
          message += '\nEnd Inner Error Stack';
        }
      }

      message += separator;
    }

    var e = new Error(message);
    if (innerError) {
      e.innerError = innerError;
    }

    return e;
  }

  _export('AggregateError', AggregateError);

  function initializePAL(callback) {
    if (isInitialized) {
      return;
    }
    _export('isInitialized', isInitialized = true);
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

  function reset() {
    _export('isInitialized', isInitialized = false);
  }

  _export('reset', reset);

  return {
    setters: [],
    execute: function () {
      _export('FEATURE', FEATURE = {});

      _export('FEATURE', FEATURE);

      _export('PLATFORM', PLATFORM = {
        noop: function noop() {},
        eachModule: function eachModule() {},
        moduleName: function (_moduleName) {
          function moduleName(_x) {
            return _moduleName.apply(this, arguments);
          }

          moduleName.toString = function () {
            return _moduleName.toString();
          };

          return moduleName;
        }(function (moduleName) {
          return moduleName;
        })
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

      _export('isInitialized', isInitialized = false);

      _export('isInitialized', isInitialized);
    }
  };
});