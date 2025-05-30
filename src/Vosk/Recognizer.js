import Vosk from "./Vosk.js";
import EventEmitter from "../Utils/EventEmitter.js";

/*
 * DO NOT EXTEND THIS CLASS YET!!!!! I am thinking of using an Event Emitter on it, but the idea is still quite abstract, I keep thinking of handling it different ways, and sometimes I think i will need to trigger it on Vosk.js and have the active rec based on this, maybe I am overthinking
 *
 * NOTE: I WILL CLEAN THESE COMMENTS LATER, please bear with them for now, sort of confusing since the rec and so on are from the WASM stuff
 * */
export default class Recognizer extends EventEmitter {
  constructor() {
    super();
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
    this.lastWord = null;
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
      "[unk]", // noise?
    ];
    const grammar = JSON.stringify([...new Set(grammarArr)]);

    // this.recognizer?.remove();
    this.recognizer = new this.model.KaldiRecognizer(16000, grammar);
    console.log(this.model.KaldiRecognizer);
    /*
     this.grammar = JSON.stringify(["placa", "pala", "ca", "bala", "paca"]);
      console.log(this.model); // SEEMS LIKE I DON'T NEED TO MAKE THIS ASYNC
      console.log(this.vosk); // FORGET IT
      console.log(this);
      this.recognizer = new this.model.KaldiRecognizer(16000, this.grammar);
      */
  }
  getResult() {
    // this.rec = this.recognizer; // before
    this.recognizer.on("result", (result) => {
      console.log(
        `Result from Recognizer: ${result.result.text}, expected result: ${this.sources.word}`,
      );
      this.lastWord = result.result.text; // before, useful
      this.trigger("onUpdateLastWord");
    });
  }
  async startStream() {
    this.streamMedia = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    this.ctx = new AudioContext({ sampleRate: 16000 });
    this.src = this.ctx.createMediaStreamSource(this.streamMedia);
    this.node = this.ctx.createScriptProcessor(4096, 1, 1);
    this.node.onaudioprocess = (e) => {
      this.recognizer.acceptWaveform(e.inputBuffer);
    };
    this.src.connect(this.node);
    this.node.connect(this.ctx.destination);
  }
  
  stopResult() {
    this.recognizer.remove();
  }

  destroy() {
    // Stop and clean up audio context and media stream
    if (this.node) {
      this.node.disconnect();
      this.node.onaudioprocess = null;
      this.node = null;
    }
    
    if (this.src) {
      this.src.disconnect();
      this.src = null;
    }
    
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
      this.ctx = null;
    }
    
    if (this.streamMedia) {
      this.streamMedia.getTracks().forEach(track => track.stop());
      this.streamMedia = null;
    }
    
    // Clean up recognizer
    if (this.recognizer) {
      this.recognizer.remove();
      this.recognizer = null;
    }
    
    // Clear all custom event callbacks
    this.callbacks = {};
    this.callbacks.base = {};
  }
}
