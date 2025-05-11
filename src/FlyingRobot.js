import Robot from "./Robot.js";

export default class FlyingRobot extends Robot {
  constructor(name, legs) {
    super(name, legs);
  }
  sayHi() {
    console.log("something else");
  }

  takeOff() {
    console.log(`Have a good flight ${this.name}`);
  }
  land() {
    console.log(`Welcome back ${this.name}`);
  }
}
