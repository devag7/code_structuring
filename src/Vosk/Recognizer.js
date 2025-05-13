import Vosk from "./Vosk.js";

/*
 * DO NOT EXTEND THIS CLASS YET!!!!! I am thinking of using an Event Emitter on it, but the idea is still quite abstract, I keep thinking of handling it different ways, and sometimes I think i will need to trigger it on Vosk.js and have the active rec based on this, maybe I am overthinking
 *
 * NOTE: I WILL CLEAN THESE COMMENTS LATER, please bear with them for now, sort of confusing since the rec and so on are from the WASM stuff
 * */
export default class Recognizer {
  constructor() {
    this.vosk = new Vosk(); // Return the Singleton
    console.log(this.vosk); // Use after creating the model (clg have createModel null)
    /*
    this.model = this.vosk.createModel; // Maybe change the name later (sort of confusing now)
    console.log(this.model); // Getting null, made it wrong, i now see it adds rec
    */

    /* NOOB MISTAKE, of course i will get undefined and just the async/await does not solve, I need to run getModel after the model is created.
    this.getModel();
*/

    this.grammar = null;
  }
  async getModel() {
    this.model = await this.vosk.model;
    console.log(this.model);

    // this.createRecognizer();
  }
  createRecognizer(sources) {
    /*this.grammar = `'[','placa', 'pala', 'ca', 'bala', 'paca' , ']'`; // sorry, backticks because of my prettier*/
    this.sources = sources;
    const grammarArr = [
      ...sources.say,
      ...sources.wrong,
      sources.word,
      "[unk]", // fallback para ruído
    ];
    const grammar = JSON.stringify([...new Set(grammarArr)]);

    // this.recognizer?.remove();
    this.recognizer = new this.model.KaldiRecognizer(16000, grammar);
    /*
     this.grammar = JSON.stringify(["placa", "pala", "ca", "bala", "paca"]);
      console.log(this.model); // SEEMS LIKE I DON'T NEED TO MAKE THIS ASYNC
      console.log(this.vosk); // FORGET IT
      console.log(this);
      this.recognizer = new this.model.KaldiRecognizer(16000, this.grammar);
      */
  }
}
