import Sizes from "../Utils/Sizes.js";
import Time from "../Utils/Time.js";

export default class Experience {
  constructor(canvas) {
    // Global access
    window.experience = this; // access from console

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();

    // console.log(this.sizes.width);

    // Sizes resize event
    this.sizes.on("resize", () => {
      // console.log("I heard a resize");
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }
  resize() {}

  update() {}
}
