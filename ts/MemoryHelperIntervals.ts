import { removeFromArray } from "j-object-functions";

/* eslint-disable @typescript-eslint/ban-types */
export type IntervalEntry = {
  name?: string;
  intervalID: IntervalID;
  interval: number;
  function: Function;
};

export type IntervalID = number;

export class MemoryHelperIntervals {
  intervals: Array<IntervalEntry>;
  constructor() {
    this.intervals = new Array();
  }

  add(entry: IntervalEntry): boolean {
    this.intervals.push(entry);
    return true;
  }

  clearInterval(entry: IntervalEntry): boolean {
    window.clearInterval(entry.intervalID);
    this.intervals = removeFromArray(this.intervals, entry);
    return true;
  }

  clearIntervalByName(name: string): boolean {
    let intervalsFound = this.intervals.filter((predicate) => {
      return predicate.name === name;
    });
    if (!this.intervals.length) return false;

    let cleared = false;
    for (let interval of intervalsFound) {
      if (this.clearInterval(interval)) cleared = true;
    }
    return cleared;
  }

  clearIntervalByID(intervalID: IntervalID): boolean {
    let intervalFound = this.intervals.find(
      (current) => current.intervalID === intervalID
    );
    if (!intervalFound) return false;
    this.clearInterval(intervalFound);
    return true;
  }

  addAndRegisterInterval(entry: {
    interval: number;
    function: Function;
    name?: string;
  }): boolean {
    let intervalID = window.setInterval(entry.function, entry.interval);
    let result = this.add({
      intervalID: intervalID,
      interval: entry.interval,
      function: entry.function,
      name: entry.name,
    });
    if (!result) return false;

    return true;
  }

  freeUpAllMemory(): boolean {
    if (!this.intervals.length) return false;
    for (const entry of this.intervals) {
      this.clearInterval(entry);
    }
    return true;
  }
}

export default MemoryHelperIntervals;
