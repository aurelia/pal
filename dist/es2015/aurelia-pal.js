
export function AggregateError(message, innerError, skipIfAlreadyAggregate) {
  if (innerError) {
    if (innerError.innerError && skipIfAlreadyAggregate) {
      return innerError;
    }

    const separator = '\n------------------------------------------------\n';

    message += `${separator}Inner Error:\n`;

    if (typeof innerError === 'string') {
      message += `Message: ${innerError}`;
    } else {
      if (innerError.message) {
        message += `Message: ${innerError.message}`;
      } else {
        message += `Unknown Inner Error Type. Displaying Inner Error as JSON:\n ${JSON.stringify(innerError, null, '  ')}`;
      }

      if (innerError.stack) {
        message += `\nInner Error Stack:\n${innerError.stack}`;
        message += '\nEnd Inner Error Stack';
      }
    }

    message += separator;
  }

  let e = new Error(message);
  if (innerError) {
    e.innerError = innerError;
  }

  return e;
}

export const FEATURE = {};

export const PLATFORM = {
  noop() {},
  eachModule() {},
  moduleName(moduleName) {
    return moduleName;
  }
};

PLATFORM.global = function () {
  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return new Function('return this')();
}();

export const DOM = {};
export let isInitialized = false;

export function initializePAL(callback) {
  if (isInitialized) {
    return;
  }
  isInitialized = true;
  if (typeof Object.getPropertyDescriptor !== 'function') {
    Object.getPropertyDescriptor = function (subject, name) {
      let pd = Object.getOwnPropertyDescriptor(subject, name);
      let proto = Object.getPrototypeOf(subject);
      while (typeof pd === 'undefined' && proto !== null) {
        pd = Object.getOwnPropertyDescriptor(proto, name);
        proto = Object.getPrototypeOf(proto);
      }
      return pd;
    };
  }

  callback(PLATFORM, FEATURE, DOM);
}
export function reset() {
  isInitialized = false;
}