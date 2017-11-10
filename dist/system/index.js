System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    /**
    * Creates an instance of Error that aggregates and preserves an innerError.
    * @param message The error message.
    * @param innerError The inner error message to aggregate.
    * @param skipIfAlreadyAggregate Indicates to not wrap the inner error if it itself already has an innerError.
    * @return The Error instance.
    */
    function AggregateError(message, innerError, skipIfAlreadyAggregate) {
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
    exports_1("AggregateError", AggregateError);
    /**
    * Enables initializing a specific implementation of the Platform Abstraction Layer (PAL).
    * @param callback Allows providing a callback which configures the three PAL singletons with their platform-specific implementations.
    */
    function initializePAL(callback) {
        if (isInitialized) {
            return;
        }
        exports_1("isInitialized", isInitialized = true);
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
    exports_1("initializePAL", initializePAL);
    function reset() {
        exports_1("isInitialized", isInitialized = false);
    }
    exports_1("reset", reset);
    var FEATURE, PLATFORM, DOM, isInitialized;
    return {
        setters: [],
        execute: function () {
            /**
            * The singleton instance of the Feature discovery API.
            */
            exports_1("FEATURE", FEATURE = {}); // HACK: `FEATURE` actually gets initialized during bootstrap but for all practical purposes we consider it as `Feature`.
            /**
            * The singleton instance of the Platform API.
            */
            exports_1("PLATFORM", PLATFORM = {
                noop: function () { },
                eachModule: function () { },
                moduleName: function (moduleName) {
                    return moduleName;
                }
            });
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
            exports_1("DOM", DOM = {}); // HACK: `DOM` actually gets initialized during bootstrap but for all practical purposes we consider it as `Dom`.
            exports_1("isInitialized", isInitialized = false);
        }
    };
});
