/**
* Creates an instance of Error that aggregates and preserves an innerError.
*/
export function AggregateError(message: string, innerError?: Error, skipIfAlreadyAggregate?: boolean): Error {
  if (innerError) {
    if (innerError.innerError && skipIfAlreadyAggregate) {
      return innerError;
    }

    if (innerError.stack) {
      message += `\n------------------------------------------------\ninner error: ${innerError.stack}`;
    }
  }

  let e = new Error(message);
  if (innerError) {
    e.innerError = innerError;
  }

  return e;
}

export FEATURE = {};
export DOM = {};
export PLATFORM = {};

export function initializePAL(platform, feature, dom) {
  Object.assign(PLATFORM, platform);
  Object.assign(FEATURE, feature);
  Object.assign(DOM, dom);
}
