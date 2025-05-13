import Vosk from "./Vosk.js";

/*
 * DO NOT EXTEND THIS CLASS YET!!!!! I am thinking of using an Event Emitter on it, but the idea is still quite abstract, I keep thinking of handling it different ways, and sometimes I think i will need to trigger it on Vosk.js and have the active rec based on this, maybe I am overthinking
 * */
export default class Recognizer {
  constructor() {
    this.vosk = new Vosk(); // Return the Singleton
    // console.log(this.vosk); // Use after creating the model (clg have createModel null)

    this.model = this.vosk.createModel; // Maybe change the name later (sort of confusing now)
  }
}
