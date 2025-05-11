export default class Sizes {
  constructor() {
    //Setup
    this.width = window.innerWidth; // for full viewport canvas
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    // console.log(this);

    // Resize event
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      // console.log(this);
    });
  }
}
