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

interface Feature {
  shadowDOM: boolean;
  scopedCSS: boolean;
  htmlTemplateElement: boolean;
  objectObserve: boolean;
  arrayObserve: boolean;
}

export const FEATURE: Feature = {};

interface Platform {
  global: Object,
  noop: Function;
  location: Object;
  history: Object;
  XMLHttpRequest: XMLHttpRequest;
  eachModule(callback: (key: string, value: Object) => boolean): void;
  addEventListener(eventName: string, callback: Function, capture: boolean): void;
  removeEventListener(eventName: string, callback: Function, capture: boolean): void;
}

export const PLATFORM: Platform = {
  noop: function() {},
  eachModule() {}
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

interface Dom {
  Element: Element;
  SVGElement: SVGElement;
  boundary: string;
  title: string;
  activeElement: Element;
  addEventListener(eventName: string, callback: Function, capture: boolean): void;
  removeEventListener(eventName: string, callback: Function, capture: boolean): void;
  adoptNode(node: Node): Node;
  createElement(tagName: string): Element;
  createTextNode(text: string): Text;
  createComment(text: string): Comment;
  createDocumentFragment(): DocumentFragment;
  createMutationObserver(callback: Function): MutationObserver;
  createCustomEvent(eventType: string, options: Object): CustomEvent;
  dispatchEvent(evt: Event): void;
  getComputedStyle(element: Element): CSSStyleDeclaration;
  getElementById(id: string): Element;
  querySelectorAll(query: string): NodeList;
  nextElementSibling(element: Node): Element;
  createTemplateFromMarkup(markup: string): Element;
  appendNode(newNode: Node, parentNode?:Node): void;
  replaceNode(newNode: Node, node: Node, parentNode: Node): void;
  removeNode(node: Node, parentNode: Node): void;
  injectStyles(styles: string, destination?: Element, prepend?:boolean): Node;
}

export const DOM: Dom = {};

export function initializePAL(callback: (platform: Platform, feature: Feature, dom: Dom) => void): void {
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
