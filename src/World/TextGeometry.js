import { TextGeometry } from "three/addons";
import Experience from "../Experience/Experience.js";
import * as THREE from "three";

export default class TextGeo {
  constructor(text) {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.font = this.resources.items.font;
    this.text = text;

    this.textGeometry = null;
    this.matcapTexture = null;
    this.textMaterial = null;
    this.textTarget = null;
    this.scene = this.experience.scene;

    this.setTextGeometry();
    this.setTextMaterial();
    this.setNewText(this.text);
  }
  setNewText(newText) {
    this.text = newText;
    if (!this.textTarget) {
      this.textTarget = new THREE.Mesh(this.textGeometry, this.textMaterial);
      this.textTarget.position.set(-3, 1, 0);
      this.scene.add(this.textTarget);
    } else {
      this.textGeometry.dispose();
      this.scene.remove(this.textTarget);

      this.setTextGeometry();
      this.textTarget = new THREE.Mesh(this.textGeometry, this.textMaterial);
      this.textTarget.position.set(-3, 1, 0);
      this.scene.add(this.textTarget);
    }
  }
  setTextGeometry() {
    this.textGeometry = new TextGeometry(this.text, {
      font: this.font,
      size: 0.5,
      depth: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });
  }
  setTextMaterial() {
    this.matcapTexture = this.resources.items.matcapTexture;
    this.matcapTexture.colorSpace = THREE.SRGBColorSpace;
    this.textMaterial = new THREE.MeshMatcapMaterial({});
    this.textMaterial.matcap = this.matcapTexture;
    this.textMaterial.wireframe = false;
  }
}
