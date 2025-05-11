import EventEmitter from "./EventEmitter.js";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();
    this.sources = sources;
  }
}
