import Experience from "../Experience/Experience.js";
import * as THREE from "three";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Vosk from "../Vosk/Vosk.js";
import { gsap } from "gsap";
import Fox from "./Fox.js";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.vosk = new Vosk();

    // Test mesh
    const testMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial(),
    );
    // console.log(testMesh.geometry.parameters.height);
    testMesh.position.y = testMesh.geometry.parameters.height * 0.5;

    this.vosk.on("onCorrectSay", () => {
      console.log("GOT THE GREAT PROGRESSSSS");

      gsap.to(testMesh.position, {
        duration: 1.5,
        ease: "power2.inOut",
        y: "+=1",
      });
    });
    this.vosk.on("onCorrectWord", () => {
      gsap.to(testMesh.rotation, {
        duration: 1.5,
        ease: "power2.inOut",
        x: "+=6",
        y: "+=3",
        z: "+=2",
      });
    });

    this.scene.add(testMesh);

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.environment = new Environment();
      this.floor = new Floor();

      // Still on test (may be game)
      this.fox = new Fox();
      this.fox.on("onAnimateFox", () => {});
    });
  }
  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
