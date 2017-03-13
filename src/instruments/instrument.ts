/**
 * Defines the instrument interface. Instruments can be attached
 * to and detached from controllers.
 */
interface Instrument {
  name: string;

  noteOn: (note: number, velocity: number) => void;
  noteOff: (note: number, velocity: number) => void;
}

export default Instrument;
