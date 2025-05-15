import Experience from "../Experience/Experience.js";
import * as THREE from "three";
import { GroundedSkybox } from "three/addons";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setSunLight();
    // this.setEnvironmentMap();
    this.setGroundedEnvironmentMap();
  }

  setSunLight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 4);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 15;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3.5, 2, -1.25);
    this.scene.add(this.sunLight);
  }

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 0.4;
    // console.log(this.resources.items);

    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

    this.scene.environment = this.environmentMap.texture;
    // this.scene.background = this.environmentMap.texture;

    this.environmentMap.updateMaterial = () => {
      this.scene.traverse((child) => {
        // console.log(child);
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterial();
  }

  setGroundedEnvironmentMap() {
    this.groundedEnvironmentMap = this.resources.items.groundEnvMap;
    this.groundedEnvironmentMap.intensity = 0.4;

    this.groundedEnvironmentMap.mapping =
      THREE.EquirectangularReflectionMapping;
    this.scene.environment = this.groundedEnvironmentMap;

    const skyBox = new GroundedSkybox(this.groundedEnvironmentMap, 15, 70);
    // skyBox.material.wireframe = true;
    skyBox.position.y = 15;
    this.scene.add(skyBox);
  }
}
