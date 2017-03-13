import Instrument from "./instrument";

/**
 * Instrument that logs out events to the console for debugging.
 */
class DebugInstrument implements Instrument {
  name: string = 'debug';

  noteOn(note: number, velocity: number) : void {
    console.log(`on ${note}(${velocity})`);
  }

  noteOff(note: number, velocity: number) : void {
    console.log(`off ${note}(${velocity})`);
  }
};
