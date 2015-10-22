declare module 'aurelia-pal' {
  
  /**
  * Enables discovery of what features the runtime environment supports.
  */
  export interface Feature {
    
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
      * Does the runtime environment support Object.observe?
      */
    objectObserve: boolean;
    
    /**
      * Does the runtime environment support Array.observe?
      */
    arrayObserve: boolean;
  }
  
  /**
  * Represents the core APIs of the runtime environment.
  */
  export interface Platform {
    
    /**
      * The runtime environment's global.
      */
    global: Object;
    
    /**
      * A function wich does nothing.
      */
    noop: Function;
    
    /**
      * The runtime's location API.
      */
    location: Object;
    
    /**
      * The runtime's history API.
      */
    history: Object;
    
    /**
      * The runtime's XMLHttpRequest API.
      */
    XMLHttpRequest: XMLHttpRequest;
    eachModule(callback: ((key: string, value: Object) => boolean)): void;
    addEventListener(eventName: string, callback: Function, capture?: boolean): void;
    removeEventListener(eventName: string, callback: Function, capture?: boolean): void;
  }
  
  /**
  * Represents the core APIs of the DOM.
  */
  export interface Dom {
    
    /**
      * The global DOM Element type.
      */
    Element: Element;
    
    /**
      * The global DOM SVGElement type.
      */
    SVGElement: SVGElement;
    
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
  * @param message The error message.
  * @param innerError The inner error message to aggregate.
  * @param skipIfAlreadyAggregate Indicates to not wrap the inner error if it itself already has an innerError.
  * @return The Error instance.
  */
  export function AggregateError(message: string, innerError?: Error, skipIfAlreadyAggregate?: boolean): Error;
  
  /**
  * The singleton instance of the Feature discovery API.
  */
  export const FEATURE: Feature;
  
  /**
  * The singleton instance of the Platform API.
  */
  export const PLATFORM: Platform;
  
  /**
  * The singleton instance of the Dom API.
  */
  export const DOM: Dom;
  
  /**
  * Enables initializing a specific implementation of the Platform Abstraction Layer (PAL).
  * @param callback Allows providing a callback which configures the three PAL singletons with their platform-specific implementations.
  */
  export function initializePAL(callback: ((platform: Platform, feature: Feature, dom: Dom) => void)): void;
}