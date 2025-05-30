import Experience from "../Experience/Experience.js";
import * as THREE from "three";
import Environment from "./Environment.js";
import Floor from "./Floor.js";
import Vosk from "../Vosk/Vosk.js";
import { gsap } from "gsap";
import Fox from "./Fox.js";
import TextGeo from "./TextGeometry.js";
// import words from "../Vosk/words.js"; // unnecessary since i can get it from Vosk, but it just shows how much of a mess i made on this last part

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.vosk = new Vosk();

    // // Test mesh
    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial(),
    // );
    // console.log(testMesh.geometry.parameters.height);
    // testMesh.position.y = testMesh.geometry.parameters.height * 0.5;

    this.vosk.on("onCorrectSay", () => {
      console.log("GOT THE GREAT PROGRESSSSS");

      gsap.to(this.fox.scene.children[5].position, {
        duration: 1.5,
        ease: "power2.inOut",
        z: "+=0.5",
      });
      console.log(this.fox.scene.children);

      // Careful here, i think I can change the text in this, but I would need to make sure that the TextGeo was created before the onCorrectSay happens, since (for now) the World is created before Vosk i think it is safe

      gsap.to(this.text.textTarget.rotation, {
        duration: 1.5,
        ease: "power2.inOut",
        x: "-=6.29",
      });
    });
    this.vosk.on("onCorrectWord", () => {
      // gsap.to(testMesh.rotation, {
      //   duration: 1.5,
      //   ease: "power2.inOut",
      //   x: "+=6",
      //   y: "+=3",
      //   z: "+=2",
      // });
      this.text.setNewText(
        this.vosk.words[this.vosk.currentWordIndex + 1].word,
      ); // KNOWN BUG: This happens before the currentWorldIndex is updated inside Vosk, another way to solve would be updating it here. I guess the best of all Would be on a Update from Experience, maybe on another refactor where I correct the places and order of the instances
      console.log(this.vosk.words[this.vosk.currentWordIndex].word);
      console.log(this.text);

      gsap.to(this.fox.scene.children[4].position, {
        duration: 1.5,
        ease: "power2.inOut",
        z: "+=3",
      });
      console.log(this.fox.scene.children);
    });

    // this.scene.add(testMesh);

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.environment = new Environment();
      this.floor = new Floor();

      // Still on test (may be game)
      this.fox = new Fox();
      this.fox.on("onAnimateFox", () => {});

      this.text = new TextGeo("placa");
    });
  }
  update() {
    if (this.fox) {
      this.fox.update();
    }
  }

  destroy() {
    // Clean up Vosk event listeners first
    if (this.vosk) {
      this.vosk.off("onCorrectSay");
      this.vosk.off("onCorrectWord");
      this.vosk.destroy();
      this.vosk = null;
    }
    
    // Clean up world components
    if (this.fox) {
      if (typeof this.fox.destroy === 'function') {
        this.fox.destroy();
      }
      this.fox = null;
    }
    
    if (this.text) {
      if (typeof this.text.destroy === 'function') {
        this.text.destroy();
      }
      this.text = null;
    }
    
    if (this.environment) {
      if (typeof this.environment.destroy === 'function') {
        this.environment.destroy();
      }
      this.environment = null;
    }
    
    if (this.floor) {
      if (typeof this.floor.destroy === 'function') {
        this.floor.destroy();
      }
      this.floor = null;
    }
    
    // Clean up resources event listeners
    if (this.resources) {
      this.resources.off("ready");
    }
    
    // Clear references
    this.experience = null;
    this.scene = null;
    this.resources = null;
  }
}
