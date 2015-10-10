declare module 'aurelia-pal' {
  export interface Feature {
    shadowDOM: boolean;
    scopedCSS: boolean;
    htmlTemplateElement: boolean;
    objectObserve: boolean;
    arrayObserve: boolean;
  }
  export interface Platform {
    global: Object;
    noop: Function;
    location: Object;
    history: Object;
    XMLHttpRequest: XMLHttpRequest;
    eachModule(callback: ((key: string, value: Object) => boolean)): void;
    addEventListener(eventName: string, callback: Function, capture: boolean): void;
    removeEventListener(eventName: string, callback: Function, capture: boolean): void;
  }
  export interface Dom {
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
    appendNode(newNode: Node, parentNode?: Node): void;
    replaceNode(newNode: Node, node: Node, parentNode: Node): void;
    removeNode(node: Node, parentNode: Node): void;
    injectStyles(styles: string, destination?: Element, prepend?: boolean): Node;
  }
  
  /**
  * Creates an instance of Error that aggregates and preserves an innerError.
  */
  export function AggregateError(message: string, innerError?: Error, skipIfAlreadyAggregate?: boolean): Error;
  export const FEATURE: Feature;
  export const PLATFORM: Platform;
  export const DOM: Dom;
  export function initializePAL(callback: ((platform: Platform, feature: Feature, dom: Dom) => void)): void;
}