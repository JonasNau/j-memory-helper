import { removeFromArray } from "j-object-functions";

/* eslint-disable @typescript-eslint/ban-types */
export type MemoryHelperTimeOutsEntry = {
  name?: string;
  timeOutID: TimeOutID;
  timeout: number;
  function: Function;
};

export type TimeOutID = number;

export class MemoryHelperTimeouts {
  timeouts: Array<MemoryHelperTimeOutsEntry>;
  constructor() {
    this.timeouts = new Array();
  }

  add(entry: MemoryHelperTimeOutsEntry): boolean {
    this.timeouts.push(entry);
    return true;
  }

  clearTimeout(entry: MemoryHelperTimeOutsEntry): boolean {
    window.clearTimeout(entry.timeOutID);
    this.timeouts = removeFromArray(this.timeouts, entry);
    return true;
  }

  clearTimeoutByName(name: string) {
    let timeout = this.timeouts.find(
      (currenttimeout) => currenttimeout.name === name
    );
    if (!timeout) {
      throw new Error(`Timeout with the name ${name} is non existent`);
    }
  }

  clearTimeoutByID(intervalID: TimeOutID): boolean {
    let timeoutFound = this.timeouts.find(
      (current) => current.timeOutID === intervalID
    );
    if (!timeoutFound) return false;
    this.clearTimeout(timeoutFound);
    return true;
  }

  addAndRegisterTimeout(entry: {
    timeout: number;
    function: Function;
    name?: string;
  }): boolean {
    let timeoutID = window.setTimeout(() => {
      entry.function();
      this.clearTimeoutByID(timeoutID);
    }, entry.timeout);
    let result = this.add({
      timeOutID: timeoutID,
      timeout: entry.timeout,
      function: entry.function,
      name: entry.name,
    });
    if (!result) return false;

    return true;
  }

  freeUpAllMemory(): boolean {
    if (!this.timeouts.length) return false;
    for (const entry of this.timeouts) {
      this.clearTimeout(entry);
    }
    return true;
  }
}

export default MemoryHelperTimeouts;
