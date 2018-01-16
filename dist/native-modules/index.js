/**
 * Creates an instance of Error that aggregates and preserves an innerError.
 * @param message The error message.
 * @param innerError The inner error message to aggregate.
 * @param skipIfAlreadyAggregate Indicates to not wrap the inner error if it itself already has an innerError.
 * @return The Error instance.
 */
export function AggregateError(message, innerError, skipIfAlreadyAggregate) {
    if (innerError) {
        if (innerError.innerError && skipIfAlreadyAggregate) {
            return innerError;
        }
        var separator = '\n------------------------------------------------\n';
        message += separator + "Inner Error:\n";
        if (typeof (innerError) === 'string') {
            message += "Message: " + innerError;
        }
        else {
            if (innerError.message) {
                message += "Message: " + innerError.message;
            }
            else {
                // tslint:disable-next-line max-line-length
                message += "Unknown Inner Error Type. Displaying Inner Error as JSON:\n " + JSON.stringify(innerError, null, '  ');
            }
            if (innerError.stack) {
                message += "\nInner Error Stack:\n" + innerError.stack;
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
/**
 * The singleton instance of the Feature discovery API.
 */
export var FEATURE = {}; // HACK: `FEATURE` actually gets initialized during bootstrap
/**
 * The singleton instance of the Platform API.
 */
export var PLATFORM = {
    noop: function () { },
    eachModule: function () { },
    moduleName: function (moduleName) {
        return moduleName;
    }
}; // HACK: `PLATFORM` actually gets initialized during bootstrap
// but for all practical purposes we consider it as <Platform>.
// tslint:disable-next-line only-arrow-functions
PLATFORM.global = (function () {
    // Workers don’t have `window`, only `self`
    if (typeof self !== 'undefined') {
        return self;
    }
    if (typeof global !== 'undefined') {
        return global;
    }
    // Not all environments allow eval and Function
    // Use only as a last resort:
    return new Function('return this')();
})();
/**
 * The singleton instance of the Dom API.
 */
export var DOM = {}; // HACK: `DOM` actually gets initialized during bootstrap
// but for all practical purposes we consider it as `Dom`.
export var isInitialized = false;
/**
 * Enables initializing a specific implementation of the Platform Abstraction Layer (PAL).
 * @param callback Allows providing a callback which configures the three PAL singletons
 *                 with their platform-specific implementations.
 */
export function initializePAL(callback) {
    if (isInitialized) {
        return;
    }
    isInitialized = true;
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
export function reset() {
    isInitialized = false;
}
