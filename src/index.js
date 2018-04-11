/**
* Creates an instance of Error that aggregates and preserves an innerError.
* @param message The error message.
* @param innerError The inner error message to aggregate.
* @param skipIfAlreadyAggregate Indicates to not wrap the inner error if it itself already has an innerError.
* @return The Error instance.
*/
export function AggregateError(message: string, innerError?: Error, skipIfAlreadyAggregate?: boolean): Error {
  if (innerError) {
    if (innerError.innerError && skipIfAlreadyAggregate) {
      return innerError;
    }

    const separator = '\n------------------------------------------------\n';

    message += `${separator}Inner Error:\n`;

    if (typeof (innerError) === 'string') {
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

/**
* Enables discovery of what features the runtime environment supports.
*/
interface Feature {
  /**
  * Does the runtime environment support ShadowDOM?
  */
  shadowDOM: boolean;
  /**
  * Does the runtime environment support the css scoped attribute?
  */
  scopedCSS: boolean;
  /**
  * Does the runtime environment support native HTMLTemplateElement?
  */
  htmlTemplateElement: boolean;

  /**
  * Does the runtime environment support native DOM mutation observers?
  */
  mutationObserver: boolean;
}

/**
* The singleton instance of the Feature discovery API.
*/
export const FEATURE: Feature = {};

/**
* The runtime's performance API.
*/
interface Performance {
  /**
  * Gets a DOMHighResTimeStamp.
  * @return The timestamp, measured in milliseconds, accurate to one thousandth of a millisecond.
  */
  now(): number;

  /**
   * Removes the given mark from the browser's performance entry buffer.
   *
   * @param {string} [markName] A DOMString representing the name of the timestamp. If this argument is omitted, all performance entries with an entry type of "mark" will be removed.
   * @memberof IPerformance
   */
  clearMarks(markName?: string): void;

  /**
   * Removes the given measure from the browser's performance entry buffer.
   *
   * @param {string} [measureName] A DOMString representing the name of the timestamp. If this argument is omitted, all performance entries with an entry type of "measure" will be removed.
   * @memberof IPerformance
   */
  clearMeasures(measureName?: string): void;

  /**
   * Returns a list of PerformanceEntry objects based on the given name and entry type.
   *
   * @param {string} name The name of the entry to retrieve
   * @param {string} [entryType] The type of entry to retrieve such as "mark". The valid entry types are listed in PerformanceEntry.entryType.
   * @returns {*}
   * @memberof IPerformance
   */
  getEntriesByName(name: string, entryType?: string): any;

  /**
   * Returns a list of PerformanceEntry objects of the given entry type.
   *
   * @param {string} entryType The type of entry to retrieve such as "mark". The valid entry types are listed in PerformanceEntry.entryType.
   * @returns {*}
   * @memberof IPerformance
   */
  getEntriesByType(entryType: string): any;

  /**
   * Creates a timestamp in the browser's performance entry buffer with the given name.
   *
   * @param {string} markName a DOMString representing the name of the mark
   * @memberof IPerformance
   */
  mark(markName: string): void;

  /**
   * Creates a named timestamp in the browser's performance entry buffer between two specified marks (known as the start mark and end mark, respectively).
   *
   * @param {string} measureName a DOMString representing the name of the measure.
   * @param {string} [startMarkName] A DOMString representing the name of the measure's starting mark. May also be the name of a PerformanceTiming property.
   * @param {string} [endMarkName] A DOMString representing the name of the measure's ending mark. May also be the name of a PerformanceTiming property.
   * @memberof IPerformance
   */
  measure(measureName: string, startMarkName?: string, endMarkName?: string): void;
}

/**
* Represents the core APIs of the runtime environment.
*/
interface Platform {
  /**
  * The runtime environment's global.
  */
  global: any;
  /**
  * A function wich does nothing.
  */
  noop: Function;
  /**
  * The runtime's location API.
  */
  location: typeof window.location;
  /**
  * The runtime's history API.
  */
  history: typeof window.history;
  /**
  * The runtime's performance API
  */
  performance: Performance;
  /**
  * Registers a function to call when the system is ready to update (repaint) the display.
  * @param callback The function to call.
  * @return A long integer value, the request id, that uniquely identifies the entry in the callback list.
  */
  requestAnimationFrame(callback: (animationFrameStart: number) => void): number;
  /**
  * The runtime's XMLHttpRequest API.
  */
  XMLHttpRequest: typeof XMLHttpRequest;
  /**
  * Iterate all modules loaded by the script loader.
  * @param callback A callback that will receive each module id along with the module object. Return true to end enumeration.
  */
  eachModule(callback: (key: string, value: Object) => boolean): void;
  /**
  * Add a global event listener.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function that receives a notification when an event of the specified type occurs.
  * @param capture If true, useCapture indicates that the user wishes to initiate capture.
  */
  addEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void;
  /**
  * Remove a global event listener.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function to remove from the event.
  * @param capture Specifies whether the listener to be removed was registered as a capturing listener or not.
  */
  removeEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture?: boolean): void;
  /**
   * Reference to the Loader Class (set after the loader has been first imported)
   */
  Loader: any;
  /**
   * Resolves a module name to a path resolvable by the loader. By default returns the first parameter.
   * It is recommended to use this for all dynamic imports as it enables static analysis
   * and optionally allows adding custom metadata used by the build step.
   *
   * References to this method should always literally call `PLATFORM.moduleName(...)`.
   * This enables the build step to statically optimize the code by replacing the reference with a string.
   *
   * @param moduleName Absolute or relative path to the module.
   * @param options Optional options used during the static analysis that inform how to process the module.
   */
  moduleName(moduleName: string, options?: ModuleNameOptions): string;
  moduleName(moduleName: string, chunk?: string): string;
}

/**
 * Options used during the static analysis that inform how to process a given module.
 */
interface ModuleNameOptions {
  /**
   * Add the module to a chunk by name
   */
  chunk?: string;
  /**
   * Optionally declare which exports are used. This enables tree-shaking when only few out of many exports are used.
   */
  exports?: string[];
}

/**
* The singleton instance of the Platform API.
*/
export const PLATFORM: Platform = {
  noop() { },
  eachModule() { },
  moduleName(moduleName) {
    return moduleName;
  }
};

PLATFORM.global = (function() {
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
* Represents the core APIs of the DOM.
*/
interface Dom {
  /**
  * The global DOM Element type.
  */
  Element: typeof Element;
  /**
  * The global DOM NodeList type.
  */
  NodeList: typeof NodeList;
  /**
  * The global DOM SVGElement type.
  */
  SVGElement: typeof SVGElement;
  /**
  * A key representing a DOM boundary.
  */
  boundary: string;
  /**
  * The document title.
  */
  title: string;
  /**
  * The document's active/focused element.
  */
  activeElement: Element;
  /**
  * Add an event listener to the document.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function or listener object that receives a notification when an event of the specified type occurs.
  * @param capture If true, useCapture indicates that the user wishes to initiate capture.
  */
  addEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture: boolean): void;
  /**
  * Remove an event listener from the document.
  * @param eventName A string representing the event type to listen for.
  * @param callback The function or listener object to remove from the event.
  * @param capture Specifies whether the listener to be removed was registered as a capturing listener or not.
  */
  removeEventListener(eventName: string, callback: EventListenerOrEventListenerObject, capture: boolean): void;
  /**
  * Adopts a node from an external document.
  * @param node The node to be adopted.
  * @return The adopted node able to be used in the document.
  */
  adoptNode(node: Node): Node;
  /**
  * Creates the specified HTML element or an HTMLUnknownElement if the given element name isn't a known one.
  * @param tagName A string that specifies the type of element to be created.
  * @return The created element.
  */
  // createElement<T extends keyof HTMLElementTagNameMap>(tagName: T): HTMLElementTagNameMap<T>;
  createElement(tagName: string): HTMLElement;
  /**
  * Creates the specified HTML attribute
  * @param name A string that specifies the name of attribute to be created.
  * @return The created attribute.
  */
  createAttribute(name: string): Attr;
  /**
  * Creates a new Text node.
  * @param text A string to populate the new Text node.
  * @return A Text node.
  */
  createTextNode(text: string): Text;
  /**
  * Creates a new Comment node.
  * @param text A string to populate the new Comment node.
  * @return A Comment node.
  */
  createComment(text: string): Comment;
  /**
  * Creates a new DocumentFragment.
  * @return A DocumentFragment.
  */
  createDocumentFragment(): DocumentFragment;
  /**
  * Creates a new HTMLTemplateElement.
  * @return An HTMLTemplateElement.
  */
  createTemplateElement(): HTMLTemplateElement;
  /**
  * Creates a new MutationObserver.
  * @param callback A callback that will recieve the change records with the mutations.
  * @return A MutationObservere.
  */
  createMutationObserver(callback: Function): MutationObserver;
  /**
  * Creates a new CustomEvent.
  * @param eventType A string representing the event type.
  * @param options An options object specifying bubbles:boolean, cancelable:boolean and/or detail:Object information.
  * @return A CustomEvent.
  */
  createCustomEvent(eventType: string, options?: CustomEventInit): CustomEvent;
  /**
  * Dispatches an event on the document.
  * @param evt The event to dispatch.
  */
  dispatchEvent(evt: Event): void;
  /**
  * Gives the values of all the CSS properties of an element after applying the active stylesheets and resolving any basic computation those values may contain.
  * @param element The Element for which to get the computed style.
  * @return The computed styles.
  */
  getComputedStyle(element: Element): CSSStyleDeclaration;
  /**
  * Locates an element in the document according to its id.
  * @param id The id to search the document for.
  * @return The found element.
  */
  getElementById(id: string): Element;
  /**
  * Performs a query selector on the document and returns first matched element, depth first.
  * @param query The query to use in searching the document.
  * @return A list of all matched elements in the document.
  */
  // enable the following two lines if we switch to TypeScript
  // querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
  // querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
  querySelector(selectors: string): Element;
  /**
  * Performs a query selector on the document and returns all located matches.
  * @param query The query to use in searching the document.
  * @return A list of all matched elements in the document.
  */
  // enable the following two lines if we switch to TypeScript
  // querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
  // querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
  querySelectorAll(selectors: string): NodeList;
  /**
  * Gets the element that is the next sibling of the provided element.
  * @param element The element whose next sibling is being located.
  * @return The next sibling Element of the provided Element.
  */
  nextElementSibling(element: Node): Element;
  /**
  * Creates an HTMLTemplateElement using the markup provided.
  * @param markup A string containing the markup to turn into a template. Note: This string must contain the template element as well.
  * @return The instance of HTMLTemplateElement that was created from the provided markup.
  */
  createTemplateFromMarkup(markup: string): HTMLTemplateElement;
  /**
  * Appends a node to the parent, if provided, or the document.body otherwise.
  * @param newNode The node to append.
  * @param parentNode The node to append to, otherwise the document.body.
  */
  appendNode(newNode: Node, parentNode?: Node): void;
  /**
  * Replaces a node in the parent with a new node.
  * @param newNode The node to replace the old node with.
  * @param node The node that is being replaced.
  * @param parentNode The node that the current node is parented to.
  */
  replaceNode(newNode: Node, node: Node, parentNode?: Node): void;
  /**
  * Removes the specified node from the parent node.
  * @param node The node to remove.
  * @param parentNode The parent node from which the node will be removed.
  */
  removeNode(node: Node, parentNode?: Node): void;
  /**
  * Injects styles into the destination element, or the document.head if no destination is provided.
  * @param styles The css text to injext.
  * @param destination The destination element to inject the css text into. If not specified it will default to the document.head.
  * @param prepend Indicates whether or not the styles should be prepended to the destination. By default they are appended.
  * @param id The existing style element's id to replace the contents for
  * @return The Style node that was created.
  */
  injectStyles(styles: string, destination?: Element, prepend?: boolean, id?: string): Node;
}

/**
* The singleton instance of the Dom API.
*/
export const DOM: Dom = {};
export let isInitialized = false;
/**
* Enables initializing a specific implementation of the Platform Abstraction Layer (PAL).
* @param callback Allows providing a callback which configures the three PAL singletons with their platform-specific implementations.
*/
export function initializePAL(callback: (platform: Platform, feature: Feature, dom: Dom) => void): void {
  if (isInitialized) {
    return;
  }
  isInitialized = true;
  if (typeof Object.getPropertyDescriptor !== 'function') {
    Object.getPropertyDescriptor = function(subject, name) {
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
