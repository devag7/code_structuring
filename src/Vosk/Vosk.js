import { createModel } from "vosk-browser";
import backend from "three/src/renderers/common/Backend.js";
import Recognizer from "./Recognizer.js";

let instance = null;

export default class Vosk {
  constructor() {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.createModel = null;
    this.streamMedia = null;
    this.lastWord = null;

    // Setup
    this.setModel();
    this.test = new Recognizer();
  }

  async setModel() {
    this.model = await createModel(
      "/vosk/model/vosk-model-small-pt-0.3.tar.gz",
      { worker: { backend: "memory" } },
    );

    await this.test.getModel(); // FINALLY
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
