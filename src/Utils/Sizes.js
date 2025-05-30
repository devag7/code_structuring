import EventEmitter from "./EventEmitter.js";

export default class Sizes extends EventEmitter {
  constructor() {
    super();
    //Setup
    this.width = window.innerWidth; // for full viewport canvas
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    // console.log(this);

    // Resize event - bind to store reference for cleanup
    this.handleResize = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      // console.log(this);

      this.trigger("resize");
    };

    window.addEventListener("resize", this.handleResize);
  }

  destroy() {
    // Remove event listener
    window.removeEventListener("resize", this.handleResize);
    
    // Clear all custom event callbacks
    this.callbacks = {};
    this.callbacks.base = {};
  }
}
