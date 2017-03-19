///<reference path="./midi.d.ts" />

import Instrument from "./instruments/instrument";
import Instruments from "./instruments";

/**
 * Entry point for midilive.js. Used to list controllers and attach them to
 * instruments.
 */
class MIDILive {
  private midi: MIDIAccess;
  private inputs: MIDIInput[];
  private globalInstruments: Instrument[];
  private inputInstruments: Object = {};

  init() : Promise<any> {
    this.midi = null;
    this.inputs = [];
    this.globalInstruments = [];
    this.inputInstruments = {};

    return new Promise((resolve, reject) => {
      navigator.requestMIDIAccess().then(
        (m) => {
          this.midi = m;
          let inputs : Iterator<MIDIInput> = m.inputs.values();
          let input : MIDIInput;
          while(input = inputs.next().value) {
            console.log(input);
            input.onmidimessage =
                (e: MIDIMessageEvent) => this.handle(e.target.id, e.data);
          }
          resolve();
        }, (err) => reject(err));
    });
  }

  listInputs() : MIDIInput[] {
    return this.inputs;
  }

  addInstrument(instrument : Instrument, input? : MIDIInput) {
    if (input) {
      if (!this.inputInstruments[input.id]) {
        this.inputInstruments[input.id] = [];
      }
      this.inputInstruments[input.id].push(instrument);
    } else {
      this.globalInstruments.push(instrument);
    }
  }

  removeInstrument(instrument : Instrument, input? : MIDIInput) {
    let remove = (arr, item) => {
      for (let i = arr.length - 1; i >= 0; --i) {
        if (arr[i] == item) {
          arr.splice(i, 1);
        }
      }
    };
    if (input && this.inputInstruments[input.id]) {
      remove(this.inputInstruments[input.id], instrument);
    } else {
      remove(this.globalInstruments, instrument);
    }
  }

  private handle(id: string, data: Uint8Array[3]) {
    console.log(`${id}: ${data}`);
  }
}

const instance = new MIDILive();
instance['Instruments'] = Instruments;

// Attach to the window for exporting.
window['MIDILive'] = instance;
