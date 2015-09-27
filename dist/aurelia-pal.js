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
  htmlTemplateElement: boolean;
  objectObserve: boolean;
  arrayObserve: boolean;
}

export const FEATURE: Feature = {};

interface Platform {
  location: Object;
  history: Object;
  XMLHttpRequest: XMLHttpRequest;
  findModuleForExport(exp: any): Object;
}

export const PLATFORM: Platform = {};

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
  boundary: string;
  adoptNode(node: Node): Node;
  createElement(tagName: string): Element;
  createTextNode(text: string): Text;
  createComment(text: string): Comment;
  createDocumentFragment(): DocumentFragment;
  createMutationObserver(callback: Function): MutationObserver;
  createCustomEvent(eventType: string, options: Object): CustomEvent;
  getComputedStyle(element: Element): CSSStyleDeclaration;
  getElementById(id: string): Element;
  querySelectorAll(query: string): NodeList;
  nextElementSibling(element: Node): Element;
  createTemplateFromMarkup(markup: string): Element;
  replaceNode(newNode: Node, node: Node, parentNode: Node): void;
  removeNode(node: Node, parentNode: Node): void;
  injectStyles(styles: string, destination?: Element, prepend?:boolean): Node;
}

export const DOM: Dom = {};

export function initializePAL(platform: Platform, feature: Feature, dom: Dom): void {
  Object.assign(PLATFORM, platform);
  Object.assign(FEATURE, feature);
  Object.assign(DOM, dom);
}
