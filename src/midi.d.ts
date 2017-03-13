interface MIDIInput {
  id: string;
  name: string;
  onmidimessage: Function;
}

interface MIDIMessageEvent {
  data: Uint8Array[3];
  target: MIDIInput;
}

interface MIDIInputMap {
  values: Iterator<MIDIInput>;
  get: (id: string) => MIDIInput;
}

interface MIDIAccess {
  inputs: MIDIInputMap;
  outputs: any;
}

interface Navigator {
  requestMIDIAccess: () => Promise<any>;
}
