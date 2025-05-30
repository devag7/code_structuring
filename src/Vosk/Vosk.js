import { createModel } from "vosk-browser";
import Recognizer from "./Recognizer.js";
import words from "./words.js";
import EventEmitter from "../Utils/EventEmitter.js";

let instance = null;

export default class Vosk extends EventEmitter {
  constructor() {
    super();
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.createModel = null;
    this.streamMedia = null;
    this.lastWord = null;
    this.rec = null;
    this.words = words;

    this.totalWords = this.words.length - 1;
    this.currentWordIndex = 0;

    // Setup
    this.setModel();
    this.test = new Recognizer();
  }

  async setModel() {
    this.model = await createModel(
      "/vosk/model/vosk-model-small-pt-0.3.tar.gz",
      { worker: { backend: "memory" } },
    );

    await this.test.getModel().then(() => {
      // FIRST REC
      this.test.createRecognizer(this.words[this.currentWordIndex]);

      console.log(this.words);
      this.answer = this.words[0].word;

      this.test.getResult();
      this.test.on("onUpdateLastWord", () => {
        console.log("Got update from Recognizer");
        this.lastWord = this.test.lastWord;

        const norm = (str) =>
          str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const tokens = norm(this.lastWord).split(/\s+/);

        if (
          this.words.some(({ say }) =>
            tokens.some((t) => say.some((s) => norm(s) === t)),
          )
        ) {
          // this.removeKaldi()
          console.log("Great progress!!!!!!");

          this.trigger("onCorrectSay");
        } else if (this.words.some(({ word }) => tokens.includes(norm(word)))) {
          this.trigger("onCorrectWord");
          this.test.stopResult(); // I don't think it is working 100% (as it keeps getting results on the last Right word)

          if (this.currentWordIndex < this.totalWords) {
            this.currentWordIndex++;
          }

          this.test.createRecognizer(this.words[this.currentWordIndex]); // Damn, just noticed: Explanation to the comment above: i then create the rec again, so it will keep going, if I need to really stop, I think I will put it inside the if above and add something like else{CLG 'Congratulations'}
          this.test.getResult();
        }
      });

      /*
       * norm is AI GENERATED!!!!! Used to remove accent and have lowercase. The conditional is also AI GENERATED!!!!! (I still think it is quite a mess, so maybe i should re structure it later
       * */

      // this.stream();

      this.test.startStream();

      /*      this.on("onCorrectWord", () => {
        if (this.answer === "placa") {
          this.rec.remove();
          this.test.createRecognizer(this.words[1]);
        }
      });*/
    }); // FINALLY
    // this.test.createRecognizer(); // SHIT
    // this.rec = await this.test.recognizer;

    /*

    this.rec = new this.model.KaldiRecognizer(
      16000,
      `["pala", "ca","placa","deletar", "[unk]"]`,
    );
    // console.log(this.rec);
    console.log(this.model);
    console.log(this.model.recognizers.entries());
    for (const [key, value] of this.model.recognizers.entries()) {
      console.log(`Key: ${key}, Value:`, value);
    }
    this.rec.on("result", (result) => {
      console.log(`Result: ${result.result.text}`);
      this.lastWord = result.result.text;

      if (this.lastWord === "deletar") {
        this.removeKaldi();
      }
    });
*/
  }

  removeKaldi() {
    console.log("tata");
    /*
    this.rec.remove(); // WRONG, SEE clg this.createModel (right) and this.rec (wrong)
*/
    for (const [key, value] of this.createModel.recognizers.entries()) {
      console.log(`Key: ${key}, Value:`, value);
    }
  }

  destroy() {
    // Clean up test recognizer
    if (this.test) {
      this.test.destroy();
      this.test = null;
    }
    
    // Clean up stream media
    if (this.streamMedia) {
      this.streamMedia.getTracks().forEach(track => track.stop());
      this.streamMedia = null;
    }
    
    // Clean up model recognizers
    if (this.model && this.model.recognizers) {
      for (const [key, value] of this.model.recognizers.entries()) {
        if (value && typeof value.remove === 'function') {
          value.remove();
        }
      }
    }
    
    // Clear model reference
    this.model = null;
    this.createModel = null;
    
    // Clear all custom event callbacks
    this.callbacks = {};
    this.callbacks.base = {};
    
    // Reset singleton instance
    instance = null;
  }

  async stream() {
    this.streamMedia = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });
    const ctx = new AudioContext({ sampleRate: 16000 });
    const src = ctx.createMediaStreamSource(this.streamMedia);
    const node = ctx.createScriptProcessor(4096, 1, 1);
    // const node = ctx.AudioWorkletNode()
    node.onaudioprocess = (e) => {
      this.rec.acceptWaveform(e.inputBuffer);
    };
    src.connect(node);
    node.connect(ctx.destination);
  }
}
