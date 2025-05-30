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

  destroy() {
    // Clean up event listeners first
    this.sizes.off("resize");
    this.time.off("tick");
    
    // Destroy utility classes
    if (this.sizes) {
      this.sizes.destroy();
      this.sizes = null;
    }
    
    if (this.time) {
      this.time.destroy();
      this.time = null;
    }
    
    // Clean up Three.js resources
    if (this.world) {
      if (typeof this.world.destroy === 'function') {
        this.world.destroy();
      }
      this.world = null;
    }
    
    if (this.renderer) {
      if (typeof this.renderer.destroy === 'function') {
        this.renderer.destroy();
      }
      this.renderer = null;
    }
    
    if (this.camera) {
      if (typeof this.camera.destroy === 'function') {
        this.camera.destroy();
      }
      this.camera = null;
    }
    
    if (this.resources) {
      if (typeof this.resources.destroy === 'function') {
        this.resources.destroy();
      }
      this.resources = null;
    }
    
    // Dispose of Three.js scene
    if (this.scene) {
      this.scene.traverse((child) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      });
      this.scene.clear();
      this.scene = null;
    }
    
    // Clear canvas reference
    this.canvas = null;
    
    // Clear global reference
    if (window.experience === this) {
      delete window.experience;
    }
    
    // Reset singleton instance
    instance = null;
  }
}
