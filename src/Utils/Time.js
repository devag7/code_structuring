import EventEmitter from "./EventEmitter.js";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;
    this.isRunning = true;
    this.animationFrameId = null;

    // Use this to wait a frame
    this.animationFrameId = window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    if (!this.isRunning) return;
    
    // console.log("tick");
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    // console.log(this.delta);

    this.trigger("tick");

    this.animationFrameId = window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  destroy() {
    // Stop the animation loop
    this.isRunning = false;
    
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Clear all custom event callbacks
    this.callbacks = {};
    this.callbacks.base = {};
  }
}
