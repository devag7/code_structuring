import EventEmitter from "../Utils/EventEmitter.js";
import Experience from "../Experience/Experience.js";
import * as THREE from "three";
import Vosk from "../Vosk/Vosk.js";

let instance = null;
export default class Fox extends EventEmitter {
  constructor() {
    super();
    if (instance) {
      return instance;
    }
    instance = this;
    this.expericence = new Experience();
    this.mixer = null;

    this.resources = this.expericence.resources;
    this.scene = this.expericence.scene;
    this.vosk = new Vosk();

    this.setFox();
    this.setAnimation(0);
    this.time = this.expericence.time;
  }
  setFox() {
    this.fox = this.resources.items.foxModel;
    console.log(this.fox);
    // this.scene.add(this.fox);
    /*    const children = this.fox.scene.children;

    for (const child of children) {
      this.scene.add(child);
    }*/

    this.fox.scene.scale.set(0.03, 0.03, 0.03);
    this.fox.scene.position.x = 2;

    this.fox.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });

    this.scene.add(this.fox.scene);
  }
  setAnimation(number) {
    this.number = number;
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.fox.scene);
    this.animation.action = this.animation.mixer.clipAction(
      this.fox.animations[this.number],
    );
    // console.log(this.fox.animations);
    this.animation.action.play();
    this.vosk.on("onCorrectSay", () => {
      this.setAnimation(1);
    });
    this.vosk.on("onCorrectWord", () => {
      console.log("fox on animation 0");
      this.setAnimation(2);
    });
  }
  update() {
    this.animation.mixer.update(this.time.delta * 0.001);
  }
}
