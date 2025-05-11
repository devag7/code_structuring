import Sizes from "../Utils/Sizes.js";

export default class Experience {
  constructor(canvas) {
    // Global access
    window.experience = this; // access from console

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    // console.log(this.sizes.width);
  }
}
