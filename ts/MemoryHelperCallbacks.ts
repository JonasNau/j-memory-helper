import { removeFromArray } from "j-object-functions";

/* eslint-disable @typescript-eslint/ban-types */
export class MemoryHelperCallbacks {
  callbacks?: Array<{
    type: string;
    callbackFunction: Function;
  }>;
  constructor() {
    this.callbacks = new Array();
  }

  createMemoryHelper() {
    this.callbacks = undefined;
    this.callbacks = new Array();
  }

  add(type: string, callbackFunction: Function): boolean {
    if (!this.callbacks) this.createMemoryHelper();
    if (!this.callbacks) return false;
    this.callbacks.push({ callbackFunction: callbackFunction, type: type });
    return true;
  }

  fireCallback(type: string) {
    if (!this.callbacks) return;
    for (const callbackObject of this.callbacks) {
      if (callbackObject.type === type) callbackObject.callbackFunction();
    }
  }

  removeCallback(type: string, callbackFunction: Function): boolean {
    if (!this.callbacks) return false;
    let found = this.callbacks.find((predicate) => {
      return (
        predicate.type === type &&
        predicate.callbackFunction === callbackFunction
      );
    });
    if (!found) return false;
    this.callbacks = removeFromArray(this.callbacks, found);
    return true;
  }

  removeAllCallbacksFromType(type: string) {
    if (!this.callbacks) return false;
    let found = this.callbacks.filter((predicate) => {
      return predicate.type === type;
    });
    if (!found.length) return false;
    for (const current of found) {
      this.callbacks = removeFromArray(this.callbacks, current);
    }
    return true;
  }

  freeUpAllMemory(): boolean {
    if (!this.callbacks) return true;
    // for (
    // 	let currentIndex = 0;
    // 	currentIndex < this.callbacks.length;
    // 	currentIndex++
    // ) {
    // 	let currentCallbackObject = this.callbacks[currentIndex];
    // 	delete this.callbacks[currentIndex];
    // }
    delete this.callbacks;
    return true;
  }
}

export default MemoryHelperCallbacks;
