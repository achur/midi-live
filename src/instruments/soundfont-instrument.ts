import Instrument from "./instrument";

/**
 *
 */
class Options {
  offDelay: number = 0;
}

/**
 * Synth instrument based on soundfonts using MIDI.js.
 *
 * Note that right now you can only use one at a time due to the design of MIDI.js. Need to update
 * with static state to support loading multiple instruments.
 */
class SoundfontInstrument implements Instrument {
  name: 'soundfont-instrument';

  constructor(readonly soundfontUrl: string, readonly instrument: string, readonly options = new Options()) {
  }

  init() : Promise<any> {
    return new Promise((resolve, reject) => {
      window.MIDI.loadPlugin({
        soundfontUrl: this.soundfontUrl,
        instrument: this.instrument,
        onsuccess: () => {
          window.MIDI.setVolume(0, 127);
          resolve();
        },
      });
    });
  }

  noteOn(note: number, velocity: number) : void {
    window.MIDI.noteOn(0, note, velocity, 0);
  }

  noteOff(note: number, velocity: number) : void {
    window.MIDI.noteOff(0, note, velocity, this.options.offDelay);
  }
};

export default SoundfontInstrument;
