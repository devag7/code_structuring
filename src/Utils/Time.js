import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    // Use this to wait a frame
    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
  tick() {
    // console.log("tick");
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    // console.log(this.delta);

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
