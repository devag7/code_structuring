import Sizes from "../Utils/Sizes.js";
import Time from "../Utils/Time.js";
import * as THREE from "three";
import Camera from "./Camera.js";
import Renderer from "../Utils/Renderer.js";
import World from "../World/World.js";
import Resources from "../Utils/Resources.js";
import sources from "./sources.js";
import Fox from "../World/Fox.js";

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
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();
    // this.fox = new Fox();

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
  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }
}
