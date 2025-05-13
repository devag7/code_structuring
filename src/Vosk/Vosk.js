import { createModel } from "vosk-browser";
import backend from "three/src/renderers/common/Backend.js";

export default class Vosk {
  constructor() {
    this.createModel = null;
    this.streamMedia = null;

    // Setup
    this.setModel();
  }

  async setModel() {
    this.createModel = await createModel(
      "/vosk/model/vosk-model-small-pt-0.3.tar.gz",
      { worker: { backend: "memory" } },
    );

    this.rec = new this.createModel.KaldiRecognizer(
      16000,
      `["pala", "ca","placa", "[unk]"]`,
    );
    this.rec.on("result", (result) => {
      console.log(`Result: ${result.result.text}`);
    });
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
