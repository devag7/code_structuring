import Sizes from "../Utils/Sizes.js";
import Time from "../Utils/Time.js";
import * as THREE from "three";
import Camera from "./Camera.js";

let instance = null;
export default class Experience {
  instance = this;
  constructor(canvas) {
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this; // access from console

    // Options
    this.canvas = canvas;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.camera = new Camera();

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
