import { removeFromArray } from "j-object-functions";

export type MemoryHelperEventListenerOptions = {
  name?: string;
  ownerOfEventListener: Window | HTMLElement | Document;
  type: string;
  eventListenerFunction: EventListener;
  options?: boolean | AddEventListenerOptions | EventListenerOptions;
};

export class MemoryHelperEventListeners {
  eventListeners?: Array<MemoryHelperEventListenerOptions>;
  constructor() {
    this.eventListeners = new Array();
  }

  createMemoryHelper() {
    this.eventListeners = undefined;
    this.eventListeners = new Array();
  }

  add(eventListenerObject: MemoryHelperEventListenerOptions): boolean {
    if (!this.eventListeners) this.createMemoryHelper();
    if (!this.eventListeners) return false;
    this.eventListeners.push(eventListenerObject);
    return true;
  }

  addAndRegisterEventListener(
    eventListenerObject: MemoryHelperEventListenerOptions
  ): boolean {
    let result = this.add(eventListenerObject);
    if (!result) return false;
    eventListenerObject.ownerOfEventListener.addEventListener(
      eventListenerObject.type,
      eventListenerObject.eventListenerFunction,
      eventListenerObject.options
    );
    return true;
  }

  removeEventListenerByName(name: string) {
    if (!this.eventListeners) return;
    let foundEventlisteners = this.eventListeners.filter((predicate) => {
      return predicate.name === name;
    });
    for (const current of foundEventlisteners) {
      this.removeEventListener(current);
    }
  }

  removeEventListener(
    memoryHelperEventListenerOptions: MemoryHelperEventListenerOptions
  ) {
    if (!this.eventListeners || this.eventListeners.length) return;
    if (memoryHelperEventListenerOptions.options !== undefined) {
      memoryHelperEventListenerOptions.ownerOfEventListener.removeEventListener(
        memoryHelperEventListenerOptions.type,
        memoryHelperEventListenerOptions.eventListenerFunction,
        memoryHelperEventListenerOptions.options
      );
    } else {
      memoryHelperEventListenerOptions.ownerOfEventListener.removeEventListener(
        memoryHelperEventListenerOptions.type,
        memoryHelperEventListenerOptions.eventListenerFunction
      );
    }

    this.eventListeners = removeFromArray(
      this.eventListeners,
      memoryHelperEventListenerOptions,
      true,
      false
    );
  }

  freeUpAllMemory() {
    if (!this.eventListeners) return true;
    for (const current of this.eventListeners) {
      this.removeEventListener(current);
    }
  }
}

export default MemoryHelperEventListeners;
