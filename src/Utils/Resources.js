import EventEmitter from "./EventEmitter.js";
import {
  FontLoader,
  GLTFLoader,
  GroundedSkybox,
  RGBELoader,
} from "three/addons";
import * as THREE from "three";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.loaders.fontLoader = new FontLoader();
    this.loaders.rgbeLoader = new RGBELoader();
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "GLTFLoader") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "rgbeTexture") {
        this.loaders.rgbeLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "font") {
        this.loaders.fontLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;
    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }

  destroy() {
    // Dispose of loaded resources
    for (const itemName in this.items) {
      const item = this.items[itemName];
      
      // Dispose of textures
      if (item instanceof THREE.Texture) {
        item.dispose();
      }
      
      // Dispose of materials and geometries in GLTF scenes
      if (item.scene) {
        item.scene.traverse((child) => {
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
      }
    }
    
    // Clear items
    this.items = {};
    
    // Clear loaders
    this.loaders = {};
    
    // Clear sources
    this.sources = null;
    
    // Clear all custom event callbacks
    this.callbacks = {};
    this.callbacks.base = {};
  }
}
