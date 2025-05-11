export default class Robot {
  constructor(name, legs) {
    this.name = name;
    this.legs = legs;
    console.log(`I am ${name}`);
  }
  sayHi() {
    console.log(`Hello! My name is ${this.name}`);
  }
}
